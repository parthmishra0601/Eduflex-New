import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-yellow-500 h-screen flex items-center justify-between">
      <div className="left ml-[30px]">
        <h1 className="md:text-4xl font-bold text-left pt-[160px] animate-fadeInUp">
          Welcome to EduFlex:
        </h1>
        <h2 className="md:text-2xl font-medium mt-4">
          Empower Your Learning, Anywhere, Anytime
        </h2>
        <Link to="/courses">
          <button className="bg-gray-700  text-white font-bold py-2 px-4 rounded">
            Get Started
          </button>
        </Link>
      </div>
      <div className="right mr-[0px] mt-[20px] h-[470px]">
        <img src='Studying5.jpg' className="w-[400px] h-[515px]"></img>
      </div>
    </div>
  );
};

export default Home;