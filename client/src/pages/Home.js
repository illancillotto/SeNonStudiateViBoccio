import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,    
  Tooltip,
  Legend
} from 'chart.js';
import Dashboard from '../components/Dashboard';
import ProgressTracker from '../components/ProgressTracker';
import Notifications from '../components/Notifications';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" gutterBottom>
              Welcome to Linux Learning Platform
            </Typography>
            <Typography variant="body1">
              Track your progress, take quizzes, and practice Linux commands all in one place.
            </Typography>
          </Paper>
        </Grid>

        {/* Dashboard Section */}
        <Grid item xs={12}>
          <Dashboard />
        </Grid>

        {/* Progress Tracker */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <ProgressTracker />
          </Paper>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Recent Notifications
            </Typography>
            <Notifications />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home; 