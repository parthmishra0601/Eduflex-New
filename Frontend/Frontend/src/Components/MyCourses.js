import React from "react";
import { motion } from "framer-motion";

const courses = [
  {
    id: 1,
    title: "React for Beginners",
    instructor: "John Doe",
    progress: 70,
  },
  {
    id: 2,
    title: "Tailwind CSS Mastery",
    instructor: "Jane Smith",
    progress: 40,
  },
  {
    id: 3,
    title: "Framer Motion Animations",
    instructor: "Emily Clark",
    progress: 90,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
};

const MyCourses = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-10 text-gray-800 dark:text-white">
      <motion.h1
        className="text-4xl font-bold mb-10 text-indigo-800 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🎓 My Courses
      </motion.h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-indigo-100 dark:border-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <h2 className="text-2xl font-semibold mb-2 text-indigo-700 dark:text-white">
              {course.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              👨‍🏫 Instructor: {course.instructor}
            </p>
            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-indigo-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
              📊 Progress: <span className="font-medium">{course.progress}%</span>
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
