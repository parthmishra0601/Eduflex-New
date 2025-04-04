import React, { useState, useEffect } from 'react';

const Progress = () => {
  const [progressData, setProgressData] = useState([
    { id: 1, course: 'React Fundamentals', completed: 75 },
    { id: 2, course: 'Node.js Basics', completed: 40 },
    { id: 3, course: 'MongoDB Essentials', completed: 90 },
    { id: 4, course: 'JavaScript Advanced', completed: 20 },
  ]);

  const [studyTime, setStudyTime] = useState([
    { id: 1, day: 'Mon', hours: 3 },
    { id: 2, day: 'Tue', hours: 2 },
    { id: 3, day: 'Wed', hours: 4 },
    { id: 4, day: 'Thu', hours: 1 },
    { id: 5, day: 'Fri', hours: 5 },
    { id: 6, day: 'Sat', hours: 0 },
    { id: 7, day: 'Sun', hours: 2 },
  ]);

  const calculateTotalStudyTime = () => {
    return studyTime.reduce((total, day) => total + day.hours, 0);
  };

  useEffect(() => {
    // Fetching logic here (if needed)
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-indigo-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-10 text-gray-800 dark:text-white">
      <h1 className="text-4xl font-bold mb-10 text-indigo-800 dark:text-white">
        📈 Progress Tracker
      </h1>

      {/* Course Progress Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-700 dark:text-indigo-300">
          🚀 Course Progress
        </h2>
        <div className="space-y-6">
          {progressData.map((item) => (
            <div
              key={item.id}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-indigo-100 dark:border-gray-700 p-5 rounded-2xl shadow-md transition-all hover:shadow-xl"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-lg">{item.course}</p>
                <div className="w-1/2">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${item.completed}%` }}
                    />
                  </div>
                  <p className="text-sm text-right text-gray-600 dark:text-gray-300 mt-1">
                    {item.completed}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Time Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-indigo-700 dark:text-indigo-300">
          📚 Weekly Study Time
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studyTime.map((item) => (
            <div
              key={item.id}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-indigo-100 dark:border-gray-700 p-5 rounded-2xl shadow-md transition-all hover:shadow-xl"
            >
              <p className="font-medium text-lg">{item.day}</p>
              <p className="text-gray-600 dark:text-gray-400">{item.hours} hours</p>
            </div>
          ))}
          <div className="bg-indigo-100 dark:bg-indigo-800 text-indigo-900 dark:text-white p-5 rounded-2xl shadow-lg flex items-center justify-center text-lg font-bold">
            Total: {calculateTotalStudyTime()} hours
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
