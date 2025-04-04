import React, { useState, useEffect } from 'react';

const Discussions = () => {
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: 'Question about React Hooks',
      author: 'Alice',
      replies: 5,
      lastActivity: '2 hours ago',
    },
    {
      id: 2,
      title: 'Node.js Best Practices',
      author: 'Bob',
      replies: 12,
      lastActivity: '1 day ago',
    },
    {
      id: 3,
      title: 'MongoDB Query Optimization',
      author: 'Charlie',
      replies: 3,
      lastActivity: '3 days ago',
    },
    {
      id: 4,
      title: 'Tailwind CSS Tips',
      author: 'David',
      replies: 8,
      lastActivity: '5 hours ago',
    },
  ]);

  useEffect(() => {
    // Fetch real data from API if needed
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-indigo-800">💬 Discussions</h1>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <div key={discussion.id} className="bg-white/80 backdrop-blur-md border border-indigo-100 rounded-lg shadow-md p-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{discussion.title}</h2>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <p>👤 {discussion.author} | 💬 {discussion.replies} replies</p>
              <p>🕒 {discussion.lastActivity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* New Discussion Form */}
      <div className="mt-12 bg-white/90 backdrop-blur-md border border-indigo-100 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Start a New Discussion</h2>
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
              placeholder="Enter discussion title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              rows="4"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
              placeholder="Start the discussion..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
          >
            Start Discussion
          </button>
        </form>
      </div>
    </div>
  );
};

export default Discussions;
