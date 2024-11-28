import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, Grid, CircularProgress } from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';

function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard/stats`);
                setDashboardData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching dashboard data');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
        </Box>
    );
    
    if (error) return (
        <Paper sx={{ p: 2, backgroundColor: '#fff3f3' }}>
            <Typography color="error">{error}</Typography>
        </Paper>
    );

    const progressChartData = {
        labels: ['Completato', 'Rimanente'],
        datasets: [{
            data: [dashboardData?.stats.progressPercentage || 0, 100 - (dashboardData?.stats.progressPercentage || 0)],
            backgroundColor: ['#4CAF50', '#e0e0e0'],
        }]
    };

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
                        <Typography variant="h6" gutterBottom>
                            Progresso Generale
                        </Typography>
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Doughnut 
                                data={progressChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    cutout: '70%'
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
                        <Typography variant="h6" gutterBottom>
                            Statistiche
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body1">
                                Quiz Completati: {dashboardData?.stats.completedQuizzes || 0}
                            </Typography>
                            <Typography variant="body1">
                                Moduli Totali: {dashboardData?.stats.totalModules || 0}
                            </Typography>
                            <Typography variant="body1">
                                Progresso: {Math.round(dashboardData?.stats.progressPercentage || 0)}%
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
                        <Typography variant="h6" gutterBottom>
                            Attività Recenti
                        </Typography>
                        <Box sx={{ mt: 2, overflow: 'auto' }}>
                            {dashboardData?.stats.recentActivity?.map((activity, index) => (
                                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                                    Modulo {activity.module} - {new Date(activity.updatedAt).toLocaleDateString()}
                                </Typography>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;