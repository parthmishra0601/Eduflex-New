import React, { useState } from 'react';

// questions.js
export const questions = {
  "Social Sciences": [
    {
      "question": "What are the key challenges faced by global governance in the 21st century?",
      "choices": ["Climate change", "Cybersecurity", "Political polarization", "All of the above"],
      "correct_answer": "All of the above"
    },
    {
      "question": "How do social behaviors influence political decision-making and policy formation?",
      "choices": ["Through public protests", "By shaping voter opinions", "Through lobbying", "All of the above"],
      "correct_answer": "All of the above"
    },
    {
      "question": "What is the role of media in shaping public opinion?",
      "choices": ["Spreading awareness", "Biasing perceptions", "Informing the public", "All of the above"],
      "correct_answer": "All of the above"
    },
    {
      "question": "How does globalization impact cultural identities?",
      "choices": ["Homogenization", "Cultural diffusion", "Loss of traditions", "All of the above"],
      "correct_answer": "All of the above"
    },
    {
      "question": "Which theory best explains class conflict in society?",
      "choices": ["Functionalism", "Marxism", "Symbolic Interactionism", "Rational Choice"],
      "correct_answer": "Marxism"
    },
    {
      "question": "What is the effect of urbanization on social structures?",
      "choices": ["Increased diversity", "Economic inequality", "Environmental degradation", "All of the above"],
      "correct_answer": "All of the above"
    },
    {
      "question": "Which is a key characteristic of a welfare state?",
      "choices": ["Minimal government intervention", "Provision of social services", "Laissez-faire economy", "None of the above"],
      "correct_answer": "Provision of social services"
    },
    {
      "question": "How do interest groups influence public policy?",
      "choices": ["Through lobbying", "Via protests", "By running for office", "Through social media"],
      "correct_answer": "Through lobbying"
    },
    {
      "question": "What is the role of civil society in democracy?",
      "choices": ["Monitor the government", "Increase political participation", "Protect individual rights", "All of the above"],
      "correct_answer": "All of the above"
    },
    {
      "question": "What is a characteristic of authoritarian regimes?",
      "choices": ["Limited political freedoms", "Free and fair elections", "Decentralized power", "None of the above"],
      "correct_answer": "Limited political freedoms"
    }
  ],
  "Business Writing": [
    {
      "question": "What are the best practices for writing effective business emails?",
      "choices": ["Clear subject lines", "Use emoticons", "Short sentences", "Both Clear subject lines and Short sentences"],
      "correct_answer": "Both Clear subject lines and Short sentences"
    },
    {
      "question": "How can business writing be made concise?",
      "choices": ["Use long descriptions", "Eliminate unnecessary words", "Use complex sentences", "Write in passive voice"],
      "correct_answer": "Eliminate unnecessary words"
    },
    {
      "question": "What is the purpose of a business proposal?",
      "choices": ["Request funding", "Sell a product", "Present an idea", "All of the above"],
      "correct_answer": "All of the above"
    },
    {
      "question": "Why is tone important in business writing?",
      "choices": ["It establishes professionalism", "It ensures clarity", "It demonstrates authority", "All of the above"],
      "correct_answer": "All of the above"
    },
    {
      "question": "What is the main goal of writing a memo?",
      "choices": ["To request action", "To share information", "To summarize a meeting", "All of the above"],
      "correct_answer": "All of the above"
    },
    {
      "question": "Which of these is an appropriate closing for a formal business letter?",
      "choices": ["Cheers", "Best regards", "Yours sincerely", "All of the above"],
      "correct_answer": "Yours sincerely"
    },
    {
      "question": "What makes business writing different from creative writing?",
      "choices": ["It is more factual", "It uses fewer descriptive details", "It focuses on clarity", "All of the above"],
      "correct_answer ": "All of the above"
    },
    {
      "question": "What should be included in the subject line of a business email?",
      "choices ": ["Brief summary of the content", "Greeting", "Recipient's name", "None of the above "],
      "correct_answer": "Brief summary of the content"
    },
    {
      "question": "What is the purpose of a business report?",
      "choices": ["To analyze data", "To make recommendations", "To present findings", "All of the above"],
      "correct_answer": "All of the above"
    },
    {
      "question": "What is the key to effective business communication?",
      "choices": ["Using jargon", "Being concise", "Using humor", "None of the above"],
      "correct_answer": "Being concise"
    }
  ]
};

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState({});

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchQuery(searchValue);

    const filteredQuestions = {};
    Object.keys(questions).forEach((skill) => {
      filteredQuestions[skill] = questions[skill].filter((question) => {
        return question.question.toLowerCase().includes(searchValue.toLowerCase());
      });
    });

    setFilteredQuestions(filteredQuestions);
  };

  return (
    <div>
      <input type="search" value={searchQuery} onChange={handleSearch} placeholder="Search for questions" />
      {Object.keys(filteredQuestions).map((skill) => (
        <div key={skill}>
          <h2>{skill}</h2>
          <ul>
            {filteredQuestions[skill].map((question, index) => (
              <li key={index}>{question.question}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}


