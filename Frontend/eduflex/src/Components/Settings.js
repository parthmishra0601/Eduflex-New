import React, { useState } from "react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

const Settings = () => {
  const [settings, setSettings] = useState({
    username: "User123",
    email: "user@example.com",
    darkMode: false,
    notifications: true,
    language: "English"
  });

  const languageOptions = ["English", "Spanish", "French", "German"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Settings saved:", settings);
  };

  return (
    <motion.div
      className={`min-h-screen transition-all duration-500 p-10 ${
        settings.darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
          : "bg-gradient-to-br from-pink-100 via-indigo-100 to-blue-100 text-gray-800"
      }`}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <motion.h1
        className="text-4xl font-bold mb-10"
        custom={1}
        variants={fadeIn}
      >
        ⚙️ Settings
      </motion.h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-10 max-w-2xl mx-auto"
      >
        {/* Credentials */}
        <motion.div
          className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-md"
          variants={fadeIn}
          custom={2}
        >
          <h2 className="text-2xl font-semibold mb-6">👤 Credentials</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                name="username"
                type="text"
                value={settings.username}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-md"
          variants={fadeIn}
          custom={3}
        >
          <h2 className="text-2xl font-semibold mb-6">⚙️ Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleChange}
                className="h-5 w-5 text-indigo-600"
              />
              <label className="text-lg">Dark Mode</label>
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="h-5 w-5 text-indigo-600"
              />
              <label className="text-lg">Enable Notifications</label>
            </div>
          </div>
        </motion.div>

        {/* Language */}
        <motion.div
          className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-md"
          variants={fadeIn}
          custom={4}
        >
          <h2 className="text-2xl font-semibold mb-6">🌐 Language</h2>
          <select
            name="language"
            value={settings.language}
            onChange={handleChange}
            className="p-3 rounded-xl border w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Submit */}
        <motion.div variants={fadeIn} custom={5}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-indigo-600 text-white py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 transition"
          >
            Save Settings
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Settings;