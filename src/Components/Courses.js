import React, { useEffect, useState } from 'react';
import { fetchData } from './firebase';
import { Link, useNavigate } from 'react-router-dom';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Add a state for search query
  const navigate = useNavigate();

  useEffect(() => {
    const coursesPath = '/';

    fetchData(coursesPath, (retrievedData) => {
      if (retrievedData) {
        const coursesArray = Object.entries(retrievedData).map(([id, course]) => ({
          id,
          ...course,
        }));
        setCourses(coursesArray);
      } else {
        setCourses([]);
      }
    });
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value); // Update search query state
  };

  const filteredCourses = courses.filter((course) => {
    // Filter courses based on search query
    return course.Name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/quiz/${searchQuery}`);
  };

  return (
    <div className="bg-yellow-500 h-full w-screen flex items-center justify-between">
      <div className="left ml-[30px] h-full w-full">
        <h1 className="md:text-4xl font-bold text-left pt-[160px] animate-fadeInUp">
          Explore Our Courses:
        </h1>
        <h2 className="md:text-2xl font-medium mt-4">
          Learn new skills and enhance your knowledge
        </h2>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by skill"
            className="w-full p-2 mb-4 bg-gray-100 rounded"
          />
          <button type="submit" className="bg-gray-700  text-white font-bold py-2 px-4 rounded">
            Search
          </button>
        </form>
        {filteredCourses.length > 0 ? (
          <ul className="list-none">
            {filteredCourses.map((course) => (
              <li key={course.id} className="mb-4">
                <h2 className="text-2xl font-bold py-2">{course.Name}</h2>
                <a
                  href={course.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700  text-white font-bold py-2 px-4 rounded"
                >
                  Enroll
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No courses found for "{searchQuery}"</p>
        )}
      </div>
      
    </div>
  );
}

export default Courses;