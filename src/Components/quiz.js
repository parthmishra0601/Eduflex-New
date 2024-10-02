// Quiz.js
import React, { useState } from 'react';
import { questions } from './questions'; // Import the questions object directly

function Quiz() {
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [category, setCategory] = useState("Social Sciences");
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionIndex, isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionIndex]: isCorrect }));
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setScore(0);
    setShowScore(false);
    setAnswers({});
  };

  const calculateRecommendedCourses = () => {
    // This is a simple example, you can modify it to fit your needs
    if (score >= questions[category].length * 0.8) {
      setRecommendedCourses([
        { name: "Advanced Social Sciences", link: "https://www.coursera.org/specializations/social-sciences" },
        { name: "Specialized Social Sciences", link: "https://www.coursera.org/specializations/social-sciences-specialization" },
      ]);
    } else if (score >= questions[category].length * 0.5) {
      setRecommendedCourses([
        { name: "Intermediate Social Sciences", link: "https://www.coursera.org/courses?query=social%20sciences" },
        { name: "General Social Sciences", link: "https://www.coursera.org/courses?query=social%20sciences" },
      ]);
    } else {
      setRecommendedCourses([
        { name: "Beginner Social Sciences", link: "https://www.coursera.org/courses?query=social%20sciences%20for%20beginners" },
        { name: "Introductory Social Sciences", link: "https://www.coursera.org/courses?query=introductory%20social%20sciences" },
      ]);
    }
  };

  const handleSubmit = () => {
    setShowScore(true);
    calculateRecommendedCourses();
  };

  return (
    <div className="bg-yellow-500 h-full flex items-center justify-between">
      <div className="left ml-[30px] ">
        <select value={category} onChange={handleCategoryChange}>
          {Object.keys(questions).map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        {showScore ? (
          <div className="bg-yellow-500 h-screen w-screen flex justify-center items-center">
            <div className="bg-yellow-500 p-10 rounded-lg shadow-lg w-1/2 font-bold">
              <h2>Quiz finished!</h2>
              <p>
                Your score is {score} out of {questions[category].length}.
              </p>
              <p>
                Based on your score, we recommend the following course:
              </p>
              <ul>
                {recommendedCourses.map((course, index) => (
                  <li key={index}>
                    <p>{course.name}</p>
                    <button>
                      <a href={course.link} target="_blank" rel="noopener noreferrer">
                        Enroll Now
                      </a>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <h2>Questions for {category}</h2>
            <ol>
              {questions[category].map((question, index) => (
                <li key={index}>
                  <p style={{ fontWeight: 'bold' }}>
                    Question {index + 1}: {question.question}
                  </p>
                  <ul>
                    {question.choices.map((choice, choiceIndex) => (
                      <li key={choiceIndex}>
                        <button
                          style={{
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                          }}
                          onClick={() => handleAnswer(index, choice === question.correct_answer)}
                        >
                          {choiceIndex === 0 ? 'A' : choiceIndex === 1 ? 'B' : choiceIndex === 2 ? 'C' : 'D'}
                        </button>
                        <span style={{ fontWeight: 'bold' }}>{choice}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <button style={{
                fontWeight: 'bold',
                fontSize: '18px',
                padding: ' 10px 20px',
                borderRadius: '10px',
                backgroundColor: '#989898',
                color: '#fff',
                border: 'none ',
                cursor: 'pointer',
              }}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        )}
      </div>
     
    </div>
  );
}

export default Quiz;