import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const recommendedCourses = [
  {
    name: "React Basics",
    progress: 75,
    quizzes: [
      { title: "Quiz 1: Components", date: "2025-04-06", time: "10:00 AM" },
      { title: "Quiz 2: State", date: "2025-04-08", time: "2:00 PM" }
    ],
    leaderboard: ["Alice - 95%", "Bob - 92%", "Charlie - 88%"],
    discussions: ["What is useEffect?", "Props drilling issue"],
    stats: {
      enrolled: 5,
      quizzesTaken: 12,
      averageScore: 85
    },
    progressGraph: [60, 75, 80, 90],
    scoreGraph: [85, 92, 78, 95]
  },
  {
    name: "JavaScript Mastery",
    progress: 50,
    quizzes: [
      { title: "Quiz 1: Functions", date: "2025-04-07", time: "11:00 AM" },
      { title: "Quiz 2: Objects", date: "2025-04-09", time: "3:00 PM" }
    ],
    leaderboard: ["Dave - 91%", "Ella - 90%", "Frank - 88%"],
    discussions: ["Arrow functions confusion", "Prototype vs Class"],
    stats: {
      enrolled: 4,
      quizzesTaken: 10,
      averageScore: 80
    },
    progressGraph: [40, 50, 55, 60],
    scoreGraph: [70, 80, 75, 85]
  }
];

const Dashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState(recommendedCourses[0]);
  const [gradesheet, setGradesheet] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [weakestSubjects, setWeakestSubjects] = useState(null);
  const [recommendationsFromGradesheet, setRecommendationsFromGradesheet] = useState(null);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        type: 'spring',
        stiffness: 50,
      },
    }),
  };

  const progressData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Progress (%)',
        data: selectedCourse.progressGraph,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const scoreData = {
    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4'],
    datasets: [
      {
        label: 'Score',
        data: selectedCourse.scoreGraph,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const cards = [
    {
      title: 'Course Progress',
      content: (
        <>
          <div className="space-y-2">
            <p>Completed: {selectedCourse.progress}%</p>
            <div className="bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${selectedCourse.progress}%` }}></div>
            </div>
            <p>Remaining: {100 - selectedCourse.progress}%</p>
          </div>
          <div className="mt-4"><Line data={progressData} options={chartOptions} /></div>
        </>
      ),
    },
    {
      title: 'Upcoming Quizzes',
      content: (
        <>
          <ul className="list-disc list-inside">
            {selectedCourse.quizzes.map((quiz, i) => (
              <li key={i}>{quiz.title} - {quiz.date}, {quiz.time}</li>
            ))}
          </ul>
          <div className="mt-4"><Line data={scoreData} options={chartOptions} /></div>
        </>
      ),
    },
    {
      title: 'Leaderboard',
      content: (
        <ol className="list-decimal list-inside">
          {selectedCourse.leaderboard.map((user, i) => <li key={i}>{user}</li>)}
        </ol>
      ),
    },
    {
      title: 'Recent Discussions',
      content: (
        <ul className="list-disc list-inside">
          {selectedCourse.discussions.map((topic, i) => <li key={i}>{topic}</li>)}
        </ul>
      ),
    },
    {
      title: 'Your Stats',
      content: (
        <>
          <p>Courses Enrolled: {selectedCourse.stats.enrolled}</p>
          <p>Quizzes Taken: {selectedCourse.stats.quizzesTaken}</p>
          <p>Average Score: {selectedCourse.stats.averageScore}%</p>
        </>
      ),
    },
  ];

  const handleGradesheetUpload = (event) => {
    setGradesheet(event.target.files[0]);
  };

  const submitGradesheet = async () => {
    if (!gradesheet) {
      setUploadStatus('Please select a gradesheet file.');
      return;
    }

    setUploadStatus('Uploading...');
    const formData = new FormData();
    formData.append('gradesheet', gradesheet);

    try {
      const response = await fetch('http://localhost:5000/upload-gradesheet', { // Adjust the backend URL if needed
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus('Gradesheet uploaded and analyzed successfully!');
        setWeakestSubjects(data.weakest_subjects);
        setRecommendationsFromGradesheet(data.recommendations_based_on_weakness);
      } else {
        setUploadStatus(`Upload failed: ${data.error || 'An error occurred'}`);
        setWeakestSubjects(null);
        setRecommendationsFromGradesheet(null);
      }
    } catch (error) {
      console.error('Error uploading gradesheet:', error);
      setUploadStatus('Error uploading gradesheet.');
      setWeakestSubjects(null);
      setRecommendationsFromGradesheet(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-indigo-800">📊 Dashboard</h1>

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2 text-indigo-700">Recommended Course:</label>
        <select
          value={selectedCourse.name}
          onChange={(e) => {
            const course = recommendedCourses.find(c => c.name === e.target.value);
            setSelectedCourse(course);
          }}
          className="p-2 rounded-md border border-indigo-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {recommendedCourses.map((course, index) => (
            <option key={index} value={course.name}>{course.name}</option>
          ))}
        </select>
      </div>

      <motion.div
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 mb-6 border border-indigo-100"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={cards.length} // Ensure this card animates after the others
        whileHover={{ scale: 1.03 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Upload Gradesheet</h2>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="image/*, .pdf, .txt, .csv"
            onChange={handleGradesheetUpload}
            className="shadow-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
          <button
            onClick={submitGradesheet}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={!gradesheet}
          >
            Analyze Gradesheet
          </button>
        </div>
        {uploadStatus && <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>}
        {weakestSubjects && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Weakest Subjects:</h3>
            <ul className="list-disc list-inside">
              {Object.entries(weakestSubjects).map(([subject, score]) => (
                <li key={subject}>{subject}: {score}</li>
              ))}
            </ul>
          </div>
        )}
        {recommendationsFromGradesheet && recommendationsFromGradesheet.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Course Recommendations based on Weakest Subjects:</h3>
            <ul>
              {recommendationsFromGradesheet.map((course) => (
                <li key={course.course_name} className="mb-2">
                  <strong className="block font-medium text-indigo-700">{course.course_name}</strong>
                  <span className="text-gray-600">Subject: {course[Object.keys(course).find(key => key.includes('category') || key.includes('sub_category') || key.includes('course_type'))]}</span>
                  {course.course_rating && <span className="text-gray-600 ml-2">Rating: {course.course_rating}</span>}
                  {course.course_link && <a href={course.course_link} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline ml-2">Learn More</a>}
                </li>
              ))}
            </ul>
          </div>
        )}
        {recommendationsFromGradesheet && recommendationsFromGradesheet.length === 0 && weakestSubjects && (
          <p className="mt-2 text-sm text-gray-600">No specific course recommendations found for the identified weakest subjects.</p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-indigo-100"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            whileHover={{ scale: 1.03 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{card.title}</h2>
            {card.content}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;