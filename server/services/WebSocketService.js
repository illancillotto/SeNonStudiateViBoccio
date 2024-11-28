const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

class WebSocketService {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST']
      }
    });

    this.io.use((socket, next) => {
      if (socket.handshake.auth && socket.handshake.auth.token) {
        jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) return next(new Error('Authentication error'));
          socket.userId = decoded.id;
          next();
        });
      } else {
        next(new Error('Authentication error'));
      }
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.userId}`);

      socket.join(`user-${socket.userId}`);

      socket.on('quiz-start', (quizId) => {
        // Handle quiz start
      });

      socket.on('shell-command', (command) => {
        // Handle shell command
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
      });
    });
  }

  notifyUser(userId, event, data) {
    this.io.to(`user-${userId}`).emit(event, data);
  }
}

module.exports = WebSocketService;