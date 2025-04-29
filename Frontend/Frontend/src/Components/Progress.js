import React, { useState, useEffect } from 'react';

// Dummy data simulating AI recommended courses and their progress
const recommendedCourses = [
  {
    course: 'React Fundamentals',
    progress: 75,
    studyTime: [3, 2, 4, 1, 5, 0, 2],
  },
  {
    course: 'Node.js Basics',
    progress: 40,
    studyTime: [1, 1, 3, 2, 2, 0, 1],
  },
  {
    course: 'MongoDB Essentials',
    progress: 90,
    studyTime: [4, 3, 2, 5, 3, 1, 2],
  },
  {
    course: 'JavaScript Advanced',
    progress: 20,
    studyTime: [0, 1, 2, 1, 2, 0, 0],
  },
];

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Progress = () => {
  const [selectedCourse, setSelectedCourse] = useState(recommendedCourses[0]);
  const [progressData, setProgressData] = useState([]);
  const [studyTime, setStudyTime] = useState([]);

  useEffect(() => {
    // Simulate fetching AI recommended course progress
    setProgressData([
      { id: 1, course: selectedCourse.course, completed: selectedCourse.progress },
    ]);

    const time = selectedCourse.studyTime.map((hours, index) => ({
      id: index + 1,
      day: daysOfWeek[index],
      hours,
    }));
    setStudyTime(time);
  }, [selectedCourse]);

  const calculateTotalStudyTime = () => {
    return studyTime.reduce((total, day) => total + day.hours, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-indigo-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-10 text-gray-800 dark:text-white">
      <h1 className="text-4xl font-bold mb-10 text-indigo-800 dark:text-white">
        📈 Progress Tracker
      </h1>

      {/* Course Selector */}
      <div className="mb-8">
        <label className="block mb-2 text-lg font-medium text-indigo-700 dark:text-indigo-300">
          🎯 Select a Course
        </label>
        <select
          className="p-3 rounded-xl bg-white dark:bg-gray-800 text-indigo-800 dark:text-white shadow"
          onChange={(e) =>
            setSelectedCourse(
              recommendedCourses.find((course) => course.course === e.target.value)
            )
          }
          value={selectedCourse.course}
        >
          {recommendedCourses.map((course, index) => (
            <option key={index} value={course.course}>
              {course.course}
            </option>
          ))}
        </select>
      </div>

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
