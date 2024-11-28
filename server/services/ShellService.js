const fs = require('fs').promises;
const path = require('path');

class ShellService {
  constructor(userId) {
    this.userId = userId;
    this.baseDir = path.join(__dirname, '../userfs', userId.toString());
    this.currentDir = '/';
  }

  async initialize() {
    try {
      await fs.mkdir(this.baseDir, { recursive: true });
      await fs.mkdir(path.join(this.baseDir, 'home'), { recursive: true });
      await fs.writeFile(
        path.join(this.baseDir, 'home', 'welcome.txt'),
        'Welcome to the Linux simulator!'
      );
    } catch (error) {
      console.error('Error initializing user filesystem:', error);
      throw error;
    }
  }

  async executeCommand(command) {
    const [cmd, ...args] = command.split(' ');
    
    try {
      switch (cmd) {
        case 'ls':
          return await this.listDirectory(args[0] || '.');
        case 'cd':
          return await this.changeDirectory(args[0] || '~');
        case 'pwd':
          return this.currentDir;
        case 'cat':
          return await this.readFile(args[0]);
        case 'mkdir':
          return await this.makeDirectory(args[0]);
        case 'touch':
          return await this.createFile(args[0]);
        case 'rm':
          return await this.removeFile(args[0]);
        case 'echo':
          return args.join(' ');
        default:
          return `Command not found: ${cmd}`;
      }
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }

  // Additional shell command methods...
}

module.exports = ShellService;