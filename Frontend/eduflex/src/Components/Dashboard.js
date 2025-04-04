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
