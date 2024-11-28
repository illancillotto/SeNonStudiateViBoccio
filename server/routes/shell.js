const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const Activity = require('../models/Activity');

router.post('/execute', async (req, res) => {
  const { command } = req.body;
  const userId = req.user.id; // Assuming auth middleware sets this

  // Whitelist of allowed commands
  const allowedCommands = ['ls', 'pwd', 'echo', 'cat', 'mkdir', 'touch'];
  const commandBase = command.split(' ')[0];

  if (!allowedCommands.includes(commandBase)) {
    return res.status(403).json({ error: 'Command not allowed' });
  }

  exec(command, { shell: '/bin/bash' }, async (error, stdout, stderr) => {
    const output = error ? stderr : stdout;

    // Log activity
    await Activity.create({
      userId,
      type: 'shell',
      details: { command, output }
    });

    res.json({ output });
  });
});

module.exports = router;