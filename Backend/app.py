from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import logging
import requests
import html
import random
import traceback
import io
import pdfplumber

app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
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
subject_column_grades = None
grade_column_grades = None
possible_grade_column_options = ['Proficiency', 'grade']
possible_subject_column_options = ['Preferred Subject', 'subject']

for grade_option in possible_grade_column_options:
    if grade_option in grades_data.columns:
        grade_column_grades = grade_option
        break

for subject_option in possible_subject_column_options:
    if subject_option in grades_data.columns:
        subject_column_grades = subject_option
        break

if not subject_column_grades or not grade_column_grades:
    logger.error("Subject and grade columns not found in grades data.")
    exit()

courses_data.fillna('', inplace=True)

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

courses_data['combined_text'] = (
    courses_data['course_name'].astype(str) + " " +
    courses_data[subject_column_courses].astype(str) + " " +
    courses_data['course_level'].astype(str)
)

tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(courses_data['combined_text'])

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
                correct_option = chr(65 + options.index(correct_answer))
                questions_data.append({
                    "question": question_text,
                    "options": [f"{chr(65 + i)}) {opt}" for i, opt in enumerate(options)],
                    "correct_answer": correct_option
                })
            return questions_data
        return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Quiz API request error for subject '{subject}': {e}")
        return None
    except Exception as e:
        logger.error(f"Error processing quiz API response for subject '{subject}': {e}")
        return None

def determine_difficulty(score):
    try:
        score = int(score)
        if score < 50:
            return "beginner"
        elif 50 <= score <= 75:
            return "intermediate"
        else:
            return "advanced"
    except (ValueError, TypeError):
        logger.warning(f"Invalid score '{score}', defaulting to beginner difficulty.")
        return "beginner"

def recommend_courses(preferred_subjects, difficulty_level, tfidf_matrix, courses_data, top_n=5):
    global subject_column_courses
    try:
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
    except Exception as e:
        logger.error(f"Error during course recommendation: {e}")
        return pd.DataFrame()

@app.route('/upload-gradesheet', methods=['POST'])
def upload_gradesheet():
    logger.info("Received /upload-gradesheet POST request.")
    if 'file' not in request.files:
        logger.warning("No file provided in the request.")
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        logger.warning("No file selected.")
        return jsonify({"error": "No file selected"}), 400

    try:
        logger.info(f"Attempting to process file: {file.filename}, Content Type: {file.mimetype}")
        mimetype = file.mimetype

        if mimetype in ['text/csv', 'application/vnd.ms-excel', 'application/csv']:
            df = pd.read_csv(file)
        elif mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            df = pd.read_excel(file)
        elif mimetype == 'application/pdf':
            # --- PDF HANDLING START ---
            tables = []
            with pdfplumber.open(file) as pdf:
                for page in pdf.pages:
                    table = page.extract_table()
                    if table:
                        df_table = pd.DataFrame(table)
                        # Assume first row is header if table has >1 row
                        if df_table.shape[0] > 1:
                            df_table.columns = df_table.iloc[0]
                            df_table = df_table[1:]
                        tables.append(df_table)
            if not tables:
                logger.error("No tables found in PDF")
                return jsonify({"error": "No tabular data found in PDF"}), 400
            # Use first table found (modify if your PDF has multiple tables)
            df = tables[0]
            # --- PDF HANDLING END ---
        elif mimetype == 'text/plain':
            text = file.stream.read().decode('utf-8')
            try:
                df = pd.read_csv(io.StringIO(text), sep=',')
            except Exception:
                try:
                    df = pd.read_csv(io.StringIO(text), sep='\t')
                except Exception as e:
                    logger.error(f"Error reading plain text file with comma or tab separation: {e}")
                    return jsonify({"error": "Could not read plain text file with comma or tab separation."}), 400
        else:
            logger.error(f"Unsupported file type: {mimetype}")
            return jsonify({"error": f"Unsupported file type: {mimetype}. Please upload a CSV, Excel, or PDF file."}), 400

        logger.info(f"File '{file.filename}' read successfully. Columns: {df.columns.tolist()}")
        subject_col = None
        grade_col = None
        possible_subject_cols_upload = ['Preferred Subject', 'subject']
        possible_grade_cols_upload = ['Proficiency', 'grade']
        for col in possible_subject_cols_upload:
            if col in df.columns:
                subject_col = col
                break
        for col in possible_grade_cols_upload:
            if col in df.columns:
                grade_col = col
                break
        if not subject_col or not grade_col:
            logger.error("Invalid gradesheet format: Missing subject or grade columns.")
            return jsonify({"error": "Invalid gradesheet format. Ensure your file contains a subject column ('Preferred Subject' or 'subject') and a grade/proficiency column ('Proficiency' or 'grade')."}), 400
        df[subject_col] = df[subject_col].apply(standardize_subjects)
        df[grade_col] = pd.to_numeric(df[grade_col], errors='coerce')
        df.dropna(subset=[grade_col], inplace=True)
        if df.empty:
            logger.warning("No valid grades found in the uploaded file.")
            return jsonify({"error": "No valid grades found in the uploaded file."}), 400
        try:
            weakest_row = df.loc[df[grade_col].idxmin()]
            weakest_subject = standardize_subjects(weakest_row[subject_col])
            score = float(weakest_row[grade_col])
            difficulty = determine_difficulty(score)
            recommended_courses_df = recommend_courses([weakest_subject], difficulty, tfidf_matrix, courses_data)
            recommended_courses = recommended_courses_df.to_dict(orient='records')
            logger.info(f"Weakest subject: {weakest_subject}, Difficulty: {difficulty}, Recommended courses: {recommended_courses}")
            return jsonify({
                "weakest_subject": weakest_subject,
                "difficulty": difficulty,
                "recommended_courses": recommended_courses
            })
        except ValueError:
            logger.error("Could not find the weakest subject due to no valid grades.")
            return jsonify({"error": "Could not find the weakest subject due to no valid grades."}), 400

    except FileNotFoundError as e:
        logger.error(f"Error reading uploaded file '{file.filename}': {e}")
        return jsonify({"error": f"Error reading uploaded file: {e}"}), 400
    except pd.errors.EmptyDataError:
        logger.error(f"Uploaded file '{file.filename}' is empty.")
        return jsonify({"error": "Uploaded file is empty."}), 400
    except pd.errors.ParserError as e:
        logger.error(f"Error parsing uploaded file '{file.filename}': {e}")
        return jsonify({"error": f"Error parsing the file: {e}"}), 400
    except KeyError as e:
        logger.error(f"Missing column in uploaded file '{file.filename}': {e}")
        return jsonify({"error": f"Missing column in the file: {e}"}), 400
    except ValueError as e:
        logger.error(f"Value error during processing of '{file.filename}': {e}")
        return jsonify({"error": f"Value error during data processing: {e}"}), 400
    except Exception as e:
        logger.error(f"Unhandled error processing gradesheet '{file.filename}': {e}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "Failed to process gradesheet due to an unexpected error."}), 500

@app.route('/subjects', methods=['GET'])
def get_available_subjects():
    logger.info("Received /subjects GET request.")
    return jsonify(list(subject_category_mapping.keys()))

@app.route('/get-quiz', methods=['POST'])
def get_quiz_questions():
    logger.info("Received /get-quiz POST request.")
    data = request.get_json()
    subject = data.get('subject')
    if not subject or subject not in subject_category_mapping:
        logger.warning(f"Invalid subject provided: {subject}")
        return jsonify({"error": "Invalid subject"}), 400
    questions = fetch_realtime_quiz(subject)
    if questions:
        logger.info(f"Successfully fetched {len(questions)} quiz questions for subject '{subject}'.")
        return jsonify({"questions": questions})
    else:
        logger.warning(f"Could not fetch quiz questions for subject '{subject}'.")
        return jsonify({"error": "Could not fetch quiz questions"}), 500

@app.route('/submit-quiz', methods=['POST'])
def submit_quiz():
    logger.info("Received /submit-quiz POST request.")
    data = request.get_json()
    name = data.get('name')
    age = data.get('age')
    subject = data.get('subject')
    user_answers = data.get('answers')
    submitted_questions = data.get('submitted_questions')
    if not name or not age or not subject or not user_answers or not submitted_questions:
        logger.warning("Missing required data for quiz submission.")
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
    logger.info(f"Quiz submitted by {name} for subject '{subject}'. Score: {score}, Difficulty: {difficulty}, Recommended courses: {recommended_courses}")
    return jsonify({
        "score": score,
        "difficulty": difficulty,
        "recommended_courses": recommended_courses
    })

if __name__ == '__main__':
    app.run(debug=True)
