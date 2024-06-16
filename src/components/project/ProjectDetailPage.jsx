import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProjectDetailPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://54.251.25.243:8089/itss/auth/getProfile`);
        setUser(response.data.data); // Assuming you want the first user in the array
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };
    fetchDetails();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ marginLeft: '20px', padding: '20px', flex: 1 }}>
          {/* Display user details */}
          {user && (
            <div>
              <h2>User Details</h2>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Majors:</strong> {user.majors}</p>
              <p><strong>Password:</strong> {user.password}</p>
              <p><strong>MBTI:</strong> {user.mbti}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Quote:</strong> {user.quote}</p>
              <p><strong>Status:</strong> {user.status}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
