from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import logging
import requests
import html
import random

app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load datasets
try:
    courses_data = pd.read_csv('courses.csv')
    grades_data = pd.read_csv('grades.csv')
    logger.info("Datasets loaded successfully.")
except FileNotFoundError as e:
    logger.error(f"File not found: {e}")
    exit()

# Identify subject column in courses data
subject_column_courses = next((col for col in ['category', 'sub_category', 'course_type'] if col in courses_data.columns), None)
if not subject_column_courses:
    logger.error("No subject column found in courses data.")
    exit()

# Identify subject and grade columns in grades data
if 'Preferred Subject' in grades_data.columns and 'Proficiency' in grades_data.columns:
    subject_column_grades = 'Preferred Subject'
    grade_column_grades = 'Proficiency'
elif 'subject' in grades_data.columns and 'grade' in grades_data.columns:
    subject_column_grades = 'subject'
    grade_column_grades = 'grade'
else:
    logger.error("Subject and grade columns not found in grades data.")
    exit()

# Fill missing values
courses_data.fillna('', inplace=True)

# Subject standardization
def standardize_subjects(subject):
    subject = str(subject).lower()
    if 'health' in subject:
        return 'health'
    elif 'information technology' in subject or 'it' in subject:
        return 'information technology'
    elif 'math' in subject or 'logic' in subject:
        return 'math and logic'
    elif 'arts' in subject or 'humanities' in subject:
        return 'arts and humanities'
    elif 'social science' in subject or 'psychology' in subject or 'history' in subject:
        return 'social sciences'
    elif 'language' in subject:
        return 'language learning'
    elif 'computer science' in subject or 'cs' in subject or 'programming' in subject:
        return 'computer science'
    elif 'data science' in subject or 'analytics' in subject:
        return 'data science'
    elif 'business' in subject or 'management' in subject or 'finance' in subject:
        return 'business'
    elif 'project' in subject:
        return 'project management'
    elif 'design' in subject or 'ui' in subject or 'ux' in subject:
        return 'design'
    elif 'marketing' in subject or 'sales' in subject or 'advertising' in subject:
        return 'marketing'
    else:
        return 'other'

courses_data[subject_column_courses] = courses_data[subject_column_courses].apply(standardize_subjects)

# Create combined text for TF-IDF
courses_data['combined_text'] = (
    courses_data['course_name'].astype(str) + " " +
    courses_data[subject_column_courses].astype(str) + " " +
    courses_data['course_level'].astype(str)
)

# TF-IDF setup
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(courses_data['combined_text'])

# Subject to OpenTDB category mapping
subject_category_mapping = {
    'data science': 18,
    'computer science': 30,
    'business': 18,
    'health': 21,
    'information technology': 30,
    'math and logic': 19,
    'arts and humanities': 25,
    'social sciences': 23,
    'language learning': 26,
    'other': 9,
    'project management': 18,
    'design': 25,
    'marketing': 27
}

# Fetch quiz questions
def fetch_realtime_quiz(subject, num_questions=3):
    if subject not in subject_category_mapping:
        return None
    category_id = subject_category_mapping[subject]
    api_url = f"https://opentdb.com/api.php?amount={num_questions}&category={category_id}&type=multiple"

    try:
        response = requests.get(api_url)
        response.raise_for_status()
        data = response.json()
        if data['response_code'] == 0:
            questions_data = []
            for q in data['results']:
                question_text = html.unescape(q['question'])
                correct_answer = html.unescape(q['correct_answer'])
                incorrect_answers = [html.unescape(ans) for ans in q['incorrect_answers']]
                options = incorrect_answers + [correct_answer]
                random.shuffle(options)
                correct_option = chr(65 + options.index(correct_answer))  # A, B, C, D
                questions_data.append({
                    "question": question_text,
                    "options": [f"{chr(65 + i)}) {opt}" for i, opt in enumerate(options)],
                    "correct_answer": correct_option
                })
            return questions_data
        return None
    except Exception as e:
        logger.error(f"Quiz API error: {e}")
        return None

# Determine difficulty
def determine_difficulty(score):
    try:
        score = int(score)
        if score < 50:
            return "beginner"
        elif 50 <= score <= 75:
            return "intermediate"
        else:
            return "advanced"
    except:
        return "beginner"

# Recommend courses
def recommend_courses(preferred_subjects, difficulty_level, tfidf_matrix, courses_data, top_n=5):
    student_profile_vectors = tfidf.transform(preferred_subjects)
    cosine_similarities = linear_kernel(student_profile_vectors, tfidf_matrix)
    avg_similarities = cosine_similarities.mean(axis=0)

    similar_indices = avg_similarities.argsort()[:-top_n - 1:-1]
    recommended_courses = courses_data.iloc[similar_indices].copy()

    recommended_courses = recommended_courses[
        recommended_courses['course_level'].str.contains(difficulty_level, case=False, na=False)
    ]

    recommended_courses = recommended_courses.sort_values(by='course_rating', ascending=False)

    return recommended_courses[['course_name', 'course_link', subject_column_courses, 'course_rating', 'category']]

# API Endpoints
@app.route('/upload-gradesheet', methods=['POST'])
def upload_gradesheet():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        df = pd.read_csv(file)
        # You can log or analyze the data if needed
        logger.info("Gradesheet uploaded successfully.")
        logger.info(df.head())  # Optional: view uploaded data
        return jsonify({"message": "Gradesheet uploaded successfully."})
    except Exception as e:
        logger.error(f"Error processing gradesheet: {e}")
        return jsonify({"error": "Failed to process file"}), 500

@app.route('/subjects', methods=['GET'])
def get_available_subjects():
    return jsonify(list(subject_category_mapping.keys()))
    

@app.route('/get-quiz', methods=['POST'])
def get_quiz_questions():
    data = request.get_json()
    subject = data.get('subject')
    if not subject or subject not in subject_category_mapping:
        return jsonify({"error": "Invalid subject"}), 400

    questions = fetch_realtime_quiz(subject)
    if questions:
        return jsonify({"questions": questions})
    return jsonify({"error": "Could not fetch quiz questions"}), 500

@app.route('/submit-quiz', methods=['POST'])
def submit_quiz():
    data = request.get_json()
    name = data.get('name')
    age = data.get('age')
    subject = data.get('subject')
    user_answers = data.get('answers')
    submitted_questions = data.get('submitted_questions')

    if not name or not age or not subject or not user_answers or not submitted_questions:
        return jsonify({"error": "Missing required data"}), 400

    correct_answers = 0
    for i, question in enumerate(submitted_questions):
        user_answer = user_answers.get(str(i), '').strip().upper()
        correct_option = question.get('correct_answer', '').strip().upper()
        if user_answer == correct_option:
            correct_answers += 1

    score = (correct_answers / len(submitted_questions)) * 100 if submitted_questions else 0
    difficulty = determine_difficulty(score)
    recommended_courses_df = recommend_courses([subject], difficulty, tfidf_matrix, courses_data)
    recommended_courses = recommended_courses_df.to_dict(orient='records')

    return jsonify({
        "score": score,
        "difficulty": difficulty,
        "recommended_courses": recommended_courses
    })

if __name__ == '__main__':
    app.run(debug=True)
