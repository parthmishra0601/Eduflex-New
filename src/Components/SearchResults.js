import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from './firebase'; 

const SearchResults = () => {
  const { searchTerm } = useParams(); 
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Construct the correct Firebase path
        const coursePath =  `https://ailms-5b35e-default-rtdb.firebaseio.com/${searchTerm.toLowerCase().replace(/\s+/g, '')}/questions`; // Adjust as needed 
        const data = await fetchData(coursePath); // Assuming fetchData returns the data

        if (data) {
          // Convert Firebase object to an array 
          const questionsArray = Object.entries(data).map(([id, question]) => ({
            id,
            ...question
          }));
          setQuestions(questionsArray);
        } else {
          setQuestions([]); // Clear questions if no data found
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]); // Clear questions in case of error
      }
    };

    fetchQuestions();
  }, [searchTerm]); 

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">
        Questions for {searchTerm}
      </h1>

      {questions.length > 0 ? (
        <ul className="list-none">
          {questions.map((question) => (
            <li key={question.id} className="mb-4">
              <h2 className="text-2xl font-bold">{question.question}</h2>
              <ul className="list-disc pl-5">
                {question.choices.map((choice, index) => (
                  <li key={index}>{choice}</li>
                ))}
              </ul>
              <p className="text-green-600 mt-2">
                Correct Answer: {question.correct_answer}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">
          No questions found for this course.
        </p>
      )}
    </div>
  );
};

export default SearchResults;
