import React, { useState } from 'react';
import { LiaTimesSolid } from 'react-icons/lia';
import { FaBars } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate for programmatic navigation

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" }
  ];

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <nav className="w-full h-[6ch] bg-violet-500 flex items-center md:flex-row lg:px-28 md:px-16 sm:px-7 px-4 fixed top-0 z-50">
        <Link to="/" className="text-xl text-neutral-800 font-bold mr-14 cursor-pointer">
          <span>EduFlex</span>
        </Link>

        <button
          onClick={handleClick}
          className="flex-1 lg:hidden text-neutral-600 hover:text-violet-600 ease-in-out duration-300 flex items-center justify-end"
        >
          {open ? <LiaTimesSolid className="text-xl" /> : <FaBars className="text-xl" />}
        </button>

        <div
          className={`${
            open
              ? "flex absolute top-14 left-0 w-full h-auto md:h-auto md:relative"
              : "hidden"
          } flex-1 md:flex flex-col md:flex-row gap-x-5 gap-y-2.5 md:items-center md:p-0 p-4 justify-between md:bg-transparent bg-neutral-100 md:shadow-none shadow-md rounded-md`}
        >
          <ul className="list-none flex md:items-center items-start gap-x-5 gap-y-2 text-base text-gray-800 font-medium">
            {navLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} onClick={handleClose} className="hover:text-violet-600 transition duration-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

       
        </div>
      </nav>
    </div>
  );
};

export default Navbar;