import React, { useState, useEffect } from "react";
import axios from "axios";

const QuizzesPage = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [difficulty, setDifficulty] = useState("");
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const backendUrl = "http://127.0.0.1:5000"; // Define your backend URL

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`${backendUrl}/subjects`);
        setSubjects(res.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
      setLoadingSubjects(false);
    };
    fetchSubjects();
  }, []);

  const fetchQuiz = async (selectedSubject) => {
    try {
      const res = await axios.post(`${backendUrl}/get-quiz`, {
        subject: selectedSubject,
      });
      setQuestions(res.data.questions);
      setSubject(selectedSubject);
      setStep(3);
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
    }
  };

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    // Extract the answer value (e.g., "A", "B") from the option string
    const answerValue = selectedOption.split(") ")[0];
    setAnswers((prev) => ({ ...prev, [questionIndex]: answerValue }));
  };

  const handleSubmitQuiz = async () => {
    try {
      console.log("Submitting answers:", answers); // Log answers before submission
      const res = await axios.post(`${backendUrl}/submit-quiz`, {
        name,
        age,
        subject,
        answers,
      });
      console.log("Backend response:", res.data); // Log the backend response
      setScore(res.data.score);
      setDifficulty(res.data.difficulty);
      setRecommendedCourses(res.data.recommended_courses);
      setStep(4);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50">
      <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-white/50 backdrop-blur-md shadow-xl border border-white/30">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-indigo-700">
          🎓 Smart Quiz & Course Recommendation
        </h1>

        {/* Step 1: Enter Info */}
        {step === 1 && (
          <div className="space-y-5">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter your age"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <button
              onClick={() => setStep(2)}
              disabled={!name || !age}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Next ➡️
            </button>
          </div>
        )}

        {/* Step 2: Select Subject */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">📘 Select a Subject:</h2>
            {loadingSubjects ? (
              <p>Loading subjects...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjects.map((subj, index) => (
                  <button
                    key={index}
                    onClick={() => fetchQuiz(subj)}
                    className="w-full bg-white hover:bg-indigo-50 text-gray-800 border border-indigo-200 px-4 py-3 rounded-lg shadow-sm text-left capitalize transition"
                  >
                    {subj}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Quiz */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-indigo-700">📝 Quiz on {subject}</h2>
            {questions.length > 0 ? (
              questions.map((q, index) => (
                <div key={index} className="space-y-2">
                  <p className="font-medium text-gray-800">{index + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(index, opt)}
                        className={`p-3 rounded-lg border transition-all ${
                          answers[index] === opt.split(") ")[0] // Compare only the answer value
                            ? "bg-blue-100 border-blue-500"
                            : "bg-white hover:bg-gray-100 border-gray-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No questions found for this subject.</p>
            )}
            {questions.length > 0 && (
              <button
                onClick={handleSubmitQuiz}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Submit Quiz ✅
              </button>
            )}
          </div>
        )}

        {/* Step 4: Results & Recommendations */}
        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="bg-white/70 rounded-xl p-6 shadow-inner">
              <h2 className="text-3xl font-bold text-green-700">
                🎯 {name}, Your Score: {score !== null ? score.toFixed(2) : 0}%
              </h2>
              <p className="text-lg text-gray-700">Age: {age}</p>
              <p className="text-lg text-gray-700">
                Difficulty Level:{" "}
                <span className="capitalize font-semibold text-indigo-600">
                  {difficulty}
                </span>
              </p>
            </div>

            <div className="text-left">
              <h3 className="text-2xl font-semibold mb-4 text-indigo-800">📌 Recommended Courses:</h3>
              {recommendedCourses.length > 0 ? (
                <div className="grid gap-4">
                  {recommendedCourses.map((course, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg border border-gray-200 p-4 shadow-md"
                    >
                      <h4 className="font-bold text-lg">{course.course_name}</h4>
                      <p className="text-sm text-gray-600">
                        ⭐ Rating: {course.course_rating}
                      </p>
                      <p className="text-sm text-gray-600">
                        📚 Category: {course.category}
                      </p>
                      <a
                        href={course.course_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 font-medium underline mt-1 inline-block"
                      >
                        View Course →
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No recommendations found based on your quiz performance.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesPage;