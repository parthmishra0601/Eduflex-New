import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: 'easeOut'
    }
  })
};

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([
    { id: 1, name: 'Alice', score: 95 },
    { id: 2, name: 'Bob', score: 92 },
    { id: 3, name: 'Charlie', score: 88 },
    { id: 4, name: 'David', score: 85 },
    { id: 5, name: 'Eve', score: 80 },
    { id: 6, name: 'Frank', score: 78 },
    { id: 7, name: 'Grace', score: 75 },
    { id: 8, name: 'Henry', score: 72 },
    { id: 9, name: 'Ivy', score: 70 },
    { id: 10, name: 'Jack', score: 68 },
  ]);

  useEffect(() => {
    // Fetch from real API here if needed
  }, []);

  return (
    <motion.div
      className="min-h-screen p-10 bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-200 text-gray-800"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <motion.h1
        className="text-4xl font-bold mb-10 text-center"
        custom={1}
        variants={fadeIn}
      >
        🏆 Leaderboard
      </motion.h1>

      <motion.div
        className="overflow-x-auto max-w-4xl mx-auto"
        custom={2}
        variants={fadeIn}
      >
        <div className="rounded-2xl border border-gray-300 backdrop-blur-xl bg-white/70 shadow-xl overflow-hidden">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-indigo-200 text-indigo-800 text-lg">
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((user, index) => (
                <motion.tr
                  key={user.id}
                  className={`transition duration-300 ${
                    index % 2 === 0 ? 'bg-white/60' : 'bg-indigo-50/60'
                  } hover:bg-indigo-100/80`}
                  custom={index + 3}
                  variants={fadeIn}
                >
                  <td className="py-3 px-6 font-medium">{index + 1}</td>
                  <td className="py-3 px-6">{user.name}</td>
                  <td className="py-3 px-6 font-semibold">{user.score}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Leaderboard;
