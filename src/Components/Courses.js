import React, { useEffect, useState } from 'react';
import { fetchData } from './firebase'; // Assuming you have a firebase.js file for data fetching

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const coursesPath = '/'; // This is the root path, adjust if your courses are nested

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

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Courses</h1>
      {courses.length > 0 ? (
        <ul className="list-none">
          {courses.map((course) => (
            <li key={course.id} className="mb-4">
              <h2 className="text-2xl font-bold">{course.Name}</h2>
              <a
                href={course.Link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Enroll
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">Loading courses...</p>
      )}
    </div>
  );
}

export default Courses;