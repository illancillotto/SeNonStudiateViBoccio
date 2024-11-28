import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [userData, setUserData] = useState({
    recentQuizzes: [],
    shellHistory: []
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/progress');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Student Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/quiz" className="dashboard-button">
              Take a Quiz
            </Link>
            <Link to="/shell" className="dashboard-button">
              Practice Linux Commands
            </Link>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Quizzes</h2>
          <div className="recent-activities">
            {userData.recentQuizzes.map((quiz, index) => (
              <div key={index} className="activity-item">
                <span>{quiz.title}</span>
                <span>Score: {quiz.score}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Shell History</h2>
          <div className="recent-activities">
            {userData.shellHistory.map((activity, index) => (
              <div key={index} className="activity-item">
                <span>{activity.command}</span>
                <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;