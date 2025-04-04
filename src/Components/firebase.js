// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBN2GUlqWEEGll3UMc615KuLAEvvm7pYYU",
authDomain: "ailms-5b35e.firebaseapp.com",
projectId: "ailms-5b35e",
storageBucket: "ailms-5b35e.appspot.com",
messagingSenderId: "763286302009",
appId: "1:763286302009:web:28ec428b9edd4c3729cce8",
measurementId: "G-PTL7PG2ZN8",

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to retrieve data
const fetchData = (path, callback) => {
  const dataRef = ref(database, path);
  onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

// Function to upload data
const uploadData = (path, newData) => {
  const dataRef = ref(database, path);
  set(dataRef, newData)
    .then(() => console.log('Data saved successfully!'))
    .catch((error) => console.error('Error saving data:', error));
};

export { database, fetchData, uploadData };
