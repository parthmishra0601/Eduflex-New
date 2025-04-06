# backend.py (using Flask)
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from tabulate import tabulate  # You might not need this for the API
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load your datasets (ensure the paths are correct for your backend environment)
try:
    courses_data = pd.read_csv('courses.csv')
    grades_data = pd.read_csv('grades.csv')
    logger.info("Courses and grades data loaded successfully.")
except FileNotFoundError as e:
    logger.error(f"Error loading data: {e}")
    exit()

# Identify the correct subject-related column
subject_column = None
if 'category' in courses_data.columns:
    subject_column = 'category'
elif 'sub_category' in courses_data.columns:
    subject_column = 'sub_category'
elif 'course_type' in courses_data.columns:
    subject_column = 'course_type'

if subject_column is None:
    logger.error("No valid column found for subjects. Please check your dataset.")
    exit()
else:
    logger.info(f"Using '{subject_column}' as the subject column.")

# Handle missing values
courses_data.fillna('', inplace=True)

# Standardize subjects
def standardize_subjects(subject):
    subject = str(subject).lower()
    if 'health' in subject:
        return 'health'
    elif 'information technology' in subject or 'it' in subject:
        return 'information technology'
    elif 'math' in subject or 'logic' in subject:
        return 'math and logic'
    elif 'arts' in subject or 'humanities' in subject or 'literature' in subject:
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
    else:
        return 'other'

# Apply standardization
courses_data[subject_column] = courses_data[subject_column].apply(standardize_subjects)

# Combine text data for vectorization
courses_data['combined_text'] = (
    courses_data['course_name'].astype(str) + " " +
    courses_data[subject_column].astype(str) + " " +
    courses_data['course_level'].astype(str)
)

# TF-IDF Vectorizer (initialize this globally so it's fitted once)
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(courses_data['combined_text'])
logger.info("TF-IDF vectorizer fitted.")

# Quiz questions
quiz_questions = {
    'data science': [
        ("What is the most commonly used library for data visualization in Python?", ["A) Pandas", "B) Matplotlib", "C) NumPy", "D) Seaborn"], "B"),
        ("Which of these is used for supervised learning?", ["A) K-Means", "B) Linear Regression", "C) DBSCAN", "D) Apriori"], "B"),
        ("Which language is best suited for machine learning?", ["A) Python", "B) C++", "C) Java", "D) Swift"], "A"),
    ],
    'computer science': [
        ("What does OOP stand for?", ["A) Object-Oriented Programming", "B) Open Online Programming", "C) Overlapping Object Processing", "D) None"], "A"),
        ("What is the time complexity of binary search?", ["A) O(n)", "B) O(n^2)", "C) O(log n)", "D) O(1)"], "C"),
        ("Which sorting algorithm has the best average-case time complexity?", ["A) Bubble Sort", "B) Merge Sort", "C) Quick Sort", "D) Selection Sort"], "B"),
    ],
    'business': [
        ("What is ROI?", ["A) Return on Investment", "B) Risk of Inflation", "C) Rate of Interest", "D) Revenue of Industry"], "A"),
        ("Which of these is a key financial statement?", ["A) Balance Sheet", "B) Business Plan", "C) Marketing Strategy", "D) SWOT Analysis"], "A"),
        ("What does KPI stand for?", ["A) Key Performance Indicator", "B) Knowledge Process Integration", "C) Key Productivity Index", "D) Kinetic Process Implementation"], "A"),
    ],
    'health': [
        ("What is the basic structural and functional unit of life?", ["A) Tissue", "B) Organ", "C) Cell", "D) Organ System"], "C"),
        ("Which vitamin is essential for blood clotting?", ["A) Vitamin A", "B) Vitamin C", "C) Vitamin D", "D) Vitamin K"], "D"),
        ("What is the normal resting heart rate for adults?", ["A) 40-60 bpm", "B) 60-100 bpm", "C) 100-120 bpm", "D) 120-140 bpm"], "B"),
    ],
    'information technology': [
        ("What does CPU stand for?", ["A) Central Processing Unit", "B) Computer Programming Utility", "C) Common Protocol Unit", "D) Control Processing Unit"], "A"),
        ("What is RAM?", ["A) Read Only Memory", "B) Random Access Memory", "C) Redundant Array of Memory", "D) Registered Access Module"], "B"),
        ("What is the purpose of a firewall?", ["A) To speed up internet connection", "B) To protect a network from unauthorized access", "C) To organize files on a computer", "D) To enhance graphics performance"], "B"),
    ],
    'math and logic': [
        ("What is the value of pi (π) to two decimal places?", ["A) 3.10", "B) 3.14", "C) 3.16", "D) 3.20"], "B"),
        ("What is the square root of 144?", ["A) 10", "B) 12", "C) 14", "D) 16"], "B"),
        ("If A is true and B is false, what is the result of A AND B?", ["A) True", "B) False", "C) Undefined", "D) Cannot be determined"], "B"),
    ],
    'arts and humanities': [
        ("Who painted the Mona Lisa?", ["A) Vincent van Gogh", "B) Leonardo da Vinci", "C) Pablo Picasso", "D) Claude Monet"], "B"),
        ("Which ancient civilization built the Great Pyramids of Giza?", ["A) Roman", "B) Greek", "C) Egyptian", "D) Mesopotamian"], "C"),
        ("Who wrote the play 'Hamlet'?", ["A) William Shakespeare", "B) Jane Austen", "C) Charles Dickens", "D) George Bernard Shaw"], "A"),
    ],
    'social sciences': [
        ("What is the study of human society and social relationships called?", ["A) Psychology", "B) Anthropology", "C) Sociology", "D) Economics"], "C"),
        ("What event is considered the start of World War I?", ["A) Invasion of Poland", "B) Attack on Pearl Harbor", "C) Assassination of Archduke Franz Ferdinand", "D) Treaty of Versailles"], "C"),
        ("What is a form of government in which the people hold the power to rule?", ["A) Monarchy", "B) Oligarchy", "C) Democracy", "D) Autocracy"], "C"),
    ],
    'language learning': [
        ("In Spanish, what does 'Hola' mean?", ["A) Goodbye", "B) Thank you", "C) Hello", "D) Please"], "C"),
        ("In French, how do you say 'good morning'?", ["A) Bonjour", "B) Au revoir", "C) Merci", "D) S'il vous plaît"], "A"),
        ("In German, what does 'Danke' mean?", ["A) Yes", "B) No", "C) Thank you", "D) You're welcome"], "C"),
    ],
    'other': [
        ("What color is the sky on a clear day?", ["A) Green", "B) Blue", "C) Red", "D) Yellow"], "B"),
        ("What is the chemical symbol for water?", ["A) Wo", "B) Wa", "C) H2O", "D) HO2"], "C"),
        ("Which planet is known as the 'Red Planet'?", ["A) Venus", "B) Mars", "C) Jupiter", "D) Saturn"], "B"),
    ],
}

def determine_difficulty(score):
    """Determines the difficulty level based on test score."""
    if score < 50:
        return "beginner"
    elif 50 <= score <= 75:
        return "intermediate"
    else:
        return "advanced"

def recommend_courses(preferred_subjects, difficulty_level, tfidf_matrix, courses_data, top_n=5):
    """Recommend courses based on preferred subjects and difficulty level."""
    student_profile_vectors = tfidf.transform(preferred_subjects)
    cosine_similarities = linear_kernel(student_profile_vectors, tfidf_matrix)
    avg_similarities = cosine_similarities.mean(axis=0)

    similar_indices = avg_similarities.argsort()[:-top_n - 1:-1]
    recommended_courses = courses_data.iloc[similar_indices].copy()

    recommended_courses = recommended_courses[
        recommended_courses['course_level'].str.contains(difficulty_level, case=False, na=False)
    ]

    recommended_courses = recommended_courses.sort_values(by='course_rating', ascending=False)

    return recommended_courses[['course_name', 'course_link', subject_column, 'course_rating', 'category']] # Include 'category'

@app.route('/subjects', methods=['GET'])
def get_available_subjects():
    """Returns a list of available quiz subjects."""
    return jsonify(list(quiz_questions.keys()))

@app.route('/get-quiz', methods=['POST'])
def get_quiz_questions():
    """Returns quiz questions for a given subject."""
    data = request.get_json()
    subject = data.get('subject')
    if not subject or subject not in quiz_questions:
        return jsonify({"error": "No quiz available for this subject"}), 400
    questions_data = []
    for question, options, _ in quiz_questions[subject]:
        questions_data.append({"question": question, "options": options})
    return jsonify({"questions": questions_data})

@app.route('/submit-quiz', methods=['POST'])
def submit_quiz():
    """Calculates the quiz score, determines difficulty, and recommends courses."""
    data = request.get_json()
    name = data.get('name')
    age = data.get('age')
    subject = data.get('subject')
    user_answers = data.get('answers')

    logger.info(f"Received quiz submission for subject: {subject}, answers: {user_answers}")

    if not name or not age or not subject or not user_answers:
        logger.warning("Missing required data in quiz submission.")
        return jsonify({"error": "Missing required data"}), 400

    if subject not in quiz_questions:
        logger.warning(f"No quiz available for subject: {subject}")
        return jsonify({"error": "No quiz available for this subject"}), 400

    questions_with_answers = quiz_questions[subject]
    correct_answers = 0
    for i, (_, _, correct_answer) in enumerate(questions_with_answers):
        question_index_str = str(i)
        if question_index_str in user_answers:
            user_answer = user_answers[question_index_str]
            logger.info(f"Question {i}: Correct Answer='{correct_answer}', User Answer='{user_answer}'")
            if user_answer.strip().upper() == correct_answer.strip().upper():  # Case-insensitive and whitespace handling
                correct_answers += 1
        else:
            logger.info(f"Question {i}: No answer provided by user.")

    total_questions = len(questions_with_answers)
    score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
    difficulty_level = determine_difficulty(score)
    recommended_courses_df = recommend_courses([subject], difficulty_level, tfidf_matrix, courses_data)
    recommended_courses_data = recommended_courses_df.to_dict('records')

    logger.info(f"Quiz Result: Score={score:.2f}%, Difficulty='{difficulty_level}'")

    return jsonify({
        "score": score,
        "difficulty": difficulty_level,
        "recommended_courses": recommended_courses_data
    })

if __name__ == '__main__':
    app.run(debug=True)