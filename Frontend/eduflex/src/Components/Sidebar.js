import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here (clearing user session/token if needed)
    navigate("/login");
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col justify-between p-4">
      <div>
        {/* Profile Section */}
        <div className="mb-8 flex items-center">
          <img src="image.png" className="h-12 w-12 rounded-full" alt="Avatar" />
          <div className="ml-3">
            <h2 className="text-xl font-semibold">Eduflex</h2>
            <p className="text-sm text-gray-400">Your Learning Hub</p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="space-y-3">
          <SidebarLink to="/dashboard" label="📊 Dashboard" />
          <SidebarLink to="/my-courses" label="🎓 My Courses" />
          <SidebarLink to="/quiz" label="📝 Quizzes" />
          <SidebarLink to="/progress" label="📈 Progress Tracker" />
          <SidebarLink to="/leaderboard" label="🏆 Leaderboard" />
          <SidebarLink to="/discussions" label="💬 Discussions" />
          <SidebarLink to="/settings" label="⚙️ Settings" />
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full mt-8 p-2 bg-red-600 hover:bg-red-700 rounded text-white font-medium"
      >
        🚪 Logout
      </button>
    </div>
  );
};

// Reusable Sidebar Link Component
const SidebarLink = ({ to, label }) => (
  <Link
    to={to}
    className="block p-2 rounded hover:bg-gray-700 text-lg transition duration-200"
  >
    {label}
  </Link>
);

export default Sidebar;
