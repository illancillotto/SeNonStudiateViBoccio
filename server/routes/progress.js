const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const QuizAttempt = require('../models/QuizAttempt');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    // Get quiz attempts
    const quizAttempts = await QuizAttempt.find({ userId: req.user.id })
      .populate('quizId')
      .sort('-completedAt');

    // Get shell activities
    const shellActivities = await Activity.find({
      userId: req.user.id,
      type: 'shell'
    }).sort('-timestamp').limit(20);

    // Calculate quiz statistics
    const quizStats = quizAttempts.reduce((acc, attempt) => {
      if (!acc[attempt.quizId._id]) {
        acc[attempt.quizId._id] = {
          title: attempt.quizId.title,
          attempts: 0,
          bestScore: 0
        };
      }
      acc[attempt.quizId._id].attempts++;
      acc[attempt.quizId._id].bestScore = Math.max(
        acc[attempt.quizId._id].bestScore,
        attempt.score
      );
      return acc;
    }, {});

    res.json({
      quizzes: Object.values(quizStats),
      shellActivities
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching progress' });
  }
});

module.exports = router;