import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    quizzes: [],
    shellCommands: [],
    dailyActivity: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Learning Progress Dashboard</h2>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Quiz Performance</h3>
          <Line
            data={{
              labels: stats.quizzes.map(q => q.date),
              datasets: [{
                label: 'Quiz Scores',
                data: stats.quizzes.map(q => q.score),
                borderColor: '#4CAF50'
              }]
            }}
          />
        </div>

        <div className="dashboard-card">
          <h3>Most Used Shell Commands</h3>
          <Bar
            data={{
              labels: stats.shellCommands.map(cmd => cmd.command),
              datasets: [{
                label: 'Usage Count',
                data: stats.shellCommands.map(cmd => cmd.count),
                backgroundColor: '#2196F3'
              }]
            }}
          />
        </div>

        <div className="dashboard-card">
          <h3>Activity Distribution</h3>
          <Doughnut
            data={{
              labels: ['Quizzes', 'Shell Practice', 'Theory Reading'],
              datasets: [{
                data: [
                  stats.dailyActivity.quizzes,
                  stats.dailyActivity.shell,
                  stats.dailyActivity.theory
                ],
                backgroundColor: ['#FF9800', '#2196F3', '#4CAF50']
              }]
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;