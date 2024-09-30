import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from tabulate import tabulate
import firebase_config

# Load the datasets
student_data = pd.read_csv('F:/Data/grades.csv')
courses_data = pd.read_csv('F:/Data/courses.csv')

# Standardize subject names
def standardize_subjects(subject):
    subject = subject.lower()
    if 'health' in subject:
        return 'health'
    elif 'information technology' in subject:
        return 'information technology'
    elif 'math' in subject:
        return 'math and logic'
    elif 'arts' in subject:
        return 'arts and humanities'
    elif 'social sciences' in subject:
        return 'social sciences'
    elif 'language' in subject:
        return 'language learning'
    elif 'computer science' in subject:
        return 'computer science'
    elif 'data science' in subject:
        return 'data science'
    elif 'business' in subject:
        return 'business'
    else:
        return 'other'

student_data['Preferred Subject'] = student_data['Preferred Subject'].apply(standardize_subjects)
courses_data['category'] = courses_data['category'].apply(standardize_subjects)

# Combine relevant text fields from the courses dataset for vectorization
courses_data['combined_text'] = courses_data['course_name'] + " " + courses_data['sub_category'] + " " + courses_data[
    'course_level']

# Initialize TF-IDF Vectorizer
tfidf = TfidfVectorizer(stop_words='english')

# Fit and transform the combined text data
tfidf_matrix = tfidf.fit_transform(courses_data['combined_text'])

# Function to recommend courses using content-based filtering
def recommend_courses_ml(student, tfidf_matrix, courses_data, top_n=5):
    preferred_subject = student['Preferred Subject']
    student_profile = tfidf.transform([preferred_subject])

    # Compute cosine similarity between the student's preferred subject and all courses
    cosine_similarities = linear_kernel(student_profile, tfidf_matrix).flatten()

    # Get the top n similar courses
    similar_indices = cosine_similarities.argsort()[:-top_n - 1:-1]

    recommended_courses = courses_data.iloc[similar_indices]

    return recommended_courses[['course_name', 'course_link', 'university_name', 'course_type', 'course_level']]

# Function to take custom student details and recommend courses using ML
def recommend_courses_for_student_ml(name, age, preferred_subject, tfidf_matrix, courses_data, top_n=5):
    student = {'Preferred Subject': preferred_subject}
    recommended_courses = recommend_courses_ml(student, tfidf_matrix, courses_data, top_n)
    return {
        'Name': name,
        'Age': age,
        'Preferred Subject': preferred_subject,
        'Recommended Courses': recommended_courses
    }

# Get user input for student details
name = input("Enter student's name: ")
age = input("Enter student's age: ")

# Preferred subjects choice
preferred_subjects = [
    "Health",
    "Information Technology",
    "Math and Logic",
    "Arts and Humanities",
    "Social Sciences",
    "Language Learning",
    "Computer Science",
    "Data Science",
    "Business"
]

print("Choose a preferred subject from the list below:")
for i, subject in enumerate(preferred_subjects, 1):
    print(f"{i}. {subject}")

subject_choice = int(input("Enter the number corresponding to the preferred subject: "))
preferred_subject = preferred_subjects[subject_choice - 1]

# Generate and print the recommendations
custom_recommendation_ml = recommend_courses_for_student_ml(name, age, preferred_subject, tfidf_matrix, courses_data)

# Display the recommendations in a tabular format
print(
    f"\nRecommendations for {custom_recommendation_ml['Name']}, Age {custom_recommendation_ml['Age']}, Preferred Subject: {custom_recommendation_ml['Preferred Subject']}\n")
print(tabulate(custom_recommendation_ml['Recommended Courses'], headers='keys', tablefmt='pretty', showindex=False,
               colalign=("center", "center", "center", "center", "center")))

# Add the data to Firestore
db = firebase_config.db
courses_ref = db.collection('courses').document(custom_recommendation_ml['Recommended Courses'].iloc[0]['course_name'])
courses_ref.set({
    'Name': custom_recommendation_ml['Name'],
    'Age': age,
    'Preferred Subject': preferred_subject,
    'Recommended Courses': custom_recommendation_ml['Recommended Courses'].to_dict(orient='records')
})