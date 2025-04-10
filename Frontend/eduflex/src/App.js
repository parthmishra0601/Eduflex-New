import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Login from "./Components/Login";
import Signup from "./Components/SignUp";
import AvatarSelection from "./Components/AvatarSelection";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Components/Dashboard";
import Progress from "./Components/Progress";
import Leaderboard from "./Components/Leaderboard";
import Discussions from "./Components/Discussions";
import Settings from "./Components/Settings";
import MyCourses from "./Components/MyCourses";
import Quizzes from "./Components/Quizzes";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const hideSidebarRoutes = ["/login", "/signup", "/avatar", "/discussions"];
  const showSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen"> {/* Added h-screen to make the container take full viewport height */}
      {showSidebar && <Sidebar />}
      <div className="flex-1 overflow-y-auto"> {/* flex-1 makes it take remaining width, overflow-y for scrolling */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/avatar" element={<AvatarSelection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/discussions" element={<Discussions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/quiz" element={<Quizzes />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;