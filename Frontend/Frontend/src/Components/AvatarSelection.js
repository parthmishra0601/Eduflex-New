import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

const avatarsByAge = {
  child: "https://api.dicebear.com/7.x/bottts/svg?seed=Kiddo",
  teen: "https://api.dicebear.com/7.x/bottts/svg?seed=TeenBot",
  adult: "https://api.dicebear.com/7.x/bottts/svg?seed=ProBot",
  senior: "https://api.dicebear.com/7.x/bottts/svg?seed=WiseBot",
};

const AvatarSelection = () => {
  const [ageGroup, setAgeGroup] = useState("child");
  const navigate = useNavigate(); // Initialize navigation

  // Handle "Next" button click
  const handleNext = () => {
    navigate("/dashboard"); // Redirect to the next page (change route as needed)
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <h1 className="text-3xl font-bold text-white mb-6">Select Your Avatar</h1>

      {/* Age Selection Dropdown */}
      <select
        className="px-4 py-2 mb-6 rounded-lg bg-white shadow-md cursor-pointer text-gray-800"
        value={ageGroup}
        onChange={(e) => setAgeGroup(e.target.value)}
      >
        <option value="child">Child (0-12)</option>
        <option value="teen">Teen (13-19)</option>
        <option value="adult">Adult (20-59)</option>
        <option value="senior">Senior (60+)</option>
      </select>

      {/* Avatar Display */}
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
        <img
          src={avatarsByAge[ageGroup]}
          alt="Selected Avatar"
          className="w-32 h-32 rounded-full border-4 border-blue-500 transition duration-300 transform hover:scale-110"
        />
        <p className="text-lg font-semibold text-gray-700 mt-4 capitalize">
          {ageGroup} Avatar
        </p>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:scale-105 transition duration-300 shadow-lg"
      >
        Next →
      </button>
    </div>
  );
};

export default AvatarSelection;
