from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

app = Flask(__name__)
CORS(app)

# Load your course data
courses_data = pd.read_csv('courses.csv')

# Set the correct subject column
subject_column = 'category'  # ✅ Based on your CSV

# TF-IDF setup using the chosen subject column
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(courses_data[subject_column].astype(str))

# Define subject-specific quiz questions
quiz_questions = {
    "Health": [
        {"question": "What is the primary function of the immune system?", "options": ["Fight infections", "Digest food", "Regulate temperature", "Produce energy"]},
        {"question": "Which vitamin is essential for blood clotting?", "options": ["Vitamin A", "Vitamin B", "Vitamin K", "Vitamin C"]},
        {"question": "Which organ is responsible for detoxification?", "options": ["Heart", "Liver", "Lungs", "Kidneys"]},
        {"question": "Which of these diseases is caused by a virus?", "options": ["Tuberculosis", "Malaria", "Influenza", "Diabetes"]},
        {"question": "What is hypertension?", "options": ["Low blood sugar", "High blood pressure", "Heart attack", "Lung infection"]}
    ],
    "Arts And Humanities": [
        {"question": "Who painted the Mona Lisa?", "options": ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"]},
        {"question": "Which civilization built the Parthenon?", "options": ["Romans", "Egyptians", "Greeks", "Mayans"]},
        {"question": "Who wrote 'Hamlet'?", "options": ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"]},
        {"question": "Which art movement is Salvador Dalí associated with?", "options": ["Cubism", "Surrealism", "Impressionism", "Realism"]},
        {"question": "What is the study of ethics concerned with?", "options": ["Science of behavior", "Moral principles", "Economic policies", "Political systems"]}
    ],
    "Social Sciences": [
        {"question": "Who is considered the father of sociology?", "options": ["Karl Marx", "Émile Durkheim", "Max Weber", "Auguste Comte"]},
        {"question": "What is the study of human societies called?", "options": ["Biology", "Sociology", "Anthropology", "Psychology"]},
        {"question": "Which economic system is based on free markets?", "options": ["Communism", "Socialism", "Capitalism", "Feudalism"]},
        {"question": "What does GDP stand for?", "options": ["Gross Domestic Product", "General Development Plan", "Global Data Projection", "Government Debt Policy"]},
        {"question": "What is the primary focus of psychology?", "options": ["Physical health", "Human behavior and mind", "Economic policies", "Political governance"]}
    ],
    "Computer Science": [
        {"question": "What does CPU stand for?", "options": ["Central Processing Unit", "Computer Personal Unit", "Central Peripheral Unit", "Core Processing Utility"]},
        {"question": "Which programming language is known for web development?", "options": ["C", "Java", "Python", "JavaScript"]},
        {"question": "What is an algorithm?", "options": ["A type of data", "A programming language", "A set of instructions", "A computer virus"]},
        {"question": "Which of the following is a database management system?", "options": ["HTML", "CSS", "MySQL", "React"]},
        {"question": "What does HTTP stand for?", "options": ["HyperText Transfer Protocol", "Hyper Transfer Text Process", "High Transfer Technology Program", "Hyperlink and Text Transfer Protocol"]}
    ],
    "Data Science": [
        {"question": "What is the main purpose of machine learning?", "options": ["To create computer networks", "To analyze web pages", "To enable computers to learn from data", "To develop hardware"]},
        {"question": "Which library is widely used for data analysis in Python?", "options": ["NumPy", "Pandas", "TensorFlow", "Matplotlib"]},
        {"question": "What is a data frame?", "options": ["A type of loop", "A database system", "A 2D labeled data structure", "A machine learning model"]},
        {"question": "What is supervised learning?", "options": ["Training with labeled data", "Training without data", "Training only with test cases", "Training with random guesses"]},
        {"question": "Which algorithm is used for classification?", "options": ["K-Means", "Linear Regression", "Decision Tree", "Apriori"]}
    ],
    "Business": [
        {"question": "What is the main goal of marketing?", "options": ["To sell products", "To increase employee salaries", "To reduce production costs", "To manage supply chains"]},
        {"question": "What does ROI stand for?", "options": ["Return on Investment", "Rate of Interest", "Revenue over Income", "Return on Influence"]},
        {"question": "Which financial statement shows a company’s revenue and expenses?", "options": ["Balance Sheet", "Cash Flow Statement", "Income Statement", "Profit-Loss Report"]},
        {"question": "What is a startup?", "options": ["A small business", "A government project", "A non-profit organization", "A type of stock"]},
        {"question": "What is inflation?", "options": ["Increase in the price level", "Decrease in currency value", "Rise in production", "Growth in employment rates"]}
    ]
}

@app.route('/subjects', methods=['GET'])
def get_subjects():
    subjects = courses_data[subject_column].dropna().unique().tolist()
    return jsonify(subjects)

@app.route('/get-quiz', methods=['POST'])
def get_quiz():
    data = request.json
    subject = data.get('subject', '')

    if subject in quiz_questions:
        questions = quiz_questions[subject]
    else:
        questions = [{"question": f"What is a core concept in {subject}?", "options": ["Option A", "Option B", "Option C", "Option D"]} for _ in range(5)]
    
    return jsonify({"questions": questions})

@app.route('/submit-quiz', methods=['POST'])
def submit_quiz():
    data = request.json
    name = data['name']
    age = data['age']
    subject = data['subject']
    answers = data['answers']

    correct = sum(1 for a in answers.values() if a == "Option A")
    total = len(answers)
    score = (correct / total) * 100 if total > 0 else 0

    if score >= 80:
        difficulty = "Advanced"
    elif score >= 50:
        difficulty = "Intermediate"
    else:
        difficulty = "Beginner"

    student_profile = tfidf.transform([subject])
    cosine_similarities = linear_kernel(student_profile, tfidf_matrix)
    avg_similarities = cosine_similarities.mean(axis=0)
    similar_indices = avg_similarities.argsort()[:-6:-1]
    recommended_courses = courses_data.iloc[similar_indices]

    filtered_courses = recommended_courses[recommended_courses['course_level'].str.contains(difficulty, case=False, na=False)]
    filtered_courses = filtered_courses.sort_values(by='course_rating', ascending=False)

    response = filtered_courses[['course_name', 'course_link', subject_column, 'course_rating']].to_dict(orient='records')

    return jsonify({
        "score": score,
        "difficulty": difficulty,
        "recommended_courses": response
    })

if __name__ == '__main__':
    app.run(debug=True)
