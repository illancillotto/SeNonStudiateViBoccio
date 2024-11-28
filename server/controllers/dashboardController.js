const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const Quiz = require('../models/QuizModel');
const Progress = require('../models/progressModel');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Get user's progress
    const progress = await Progress.find({ user: userId });
    
    // Get completed quizzes count
    const completedQuizzes = await Quiz.countDocuments({
        'submissions.user': userId,
        'submissions.completed': true
    });

    // Calculate total progress percentage
    const totalModules = await Quiz.countDocuments();
    const progressPercentage = totalModules ? (completedQuizzes / totalModules) * 100 : 0;

    // Get recent activity
    const recentActivity = await Progress.find({ user: userId })
        .sort({ updatedAt: -1 })
        .limit(5);

    res.json({
        stats: {
            completedQuizzes,
            totalModules,
            progressPercentage,
            recentActivity
        }
    });
});

// @desc    Get user progress
// @route   GET /api/dashboard/progress
// @access  Private
const getProgress = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const progress = await Progress.find({ user: userId })
        .populate('module', 'title')
        .sort({ updatedAt: -1 });

    const progressData = progress.map(p => ({
        moduleTitle: p.module.title,
        completionPercentage: p.completionPercentage,
        lastAccessed: p.updatedAt
    }));

    res.json(progressData);
});

module.exports = {
    getDashboardStats,
    getProgress
}; 