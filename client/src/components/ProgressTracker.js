import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProgressTracker.css';

function ProgressTracker() {
  const [progress, setProgress] = useState({
    quizzes: [],
    shellActivities: []
  });

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await axios.get('/api/progress');
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  return (
    <div className="progress-container">
      <div className="progress-section">
        <h3>Quiz Progress</h3>
        <div className="quiz-progress">
          {progress.quizzes.map(quiz => (
            <div key={quiz._id} className="progress-item">
              <h4>{quiz.title}</h4>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${quiz.score}%` }}
                />
              </div>
              <span>{quiz.score}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="progress-section">
        <h3>Shell Activities</h3>
        <div className="shell-progress">
          {progress.shellActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <span className="timestamp">
                {new Date(activity.timestamp).toLocaleDateString()}
              </span>
              <span className="command">{activity.details.command}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressTracker;