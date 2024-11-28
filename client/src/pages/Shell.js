import React, { useState } from 'react';
import axios from 'axios';
import { Box, Container, Paper, TextField, Button, Typography } from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';

function Shell() {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);

  const executeCommand = async (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    const newCommand = {
      input: command,
      output: '',
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    setCommandHistory(prev => [...prev, newCommand]);
    setCommand('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/shell/execute`, {
        command
      });
      
      setCommandHistory(prev => prev.map(cmd => 
        cmd.timestamp === newCommand.timestamp 
          ? { ...cmd, output: response.data.output, status: 'success' }
          : cmd
      ));
    } catch (error) {
      setCommandHistory(prev => prev.map(cmd => 
        cmd.timestamp === newCommand.timestamp 
          ? { ...cmd, output: 'Error executing command', status: 'error' }
          : cmd
      ));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3,
          backgroundColor: '#1e1e1e',
          color: '#fff',
          minHeight: '70vh'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TerminalIcon sx={{ mr: 1 }} />
          <Typography variant="h5">Pratica Terminale Linux</Typography>
        </Box>

        <Box 
          sx={{ 
            backgroundColor: '#000',
            p: 2,
            borderRadius: 1,
            height: '50vh',
            overflowY: 'auto',
            fontFamily: 'monospace',
            mb: 2
          }}
        >
          {commandHistory.map((cmd, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#00ff00' }}>
                <Typography component="span" sx={{ mr: 1 }}>$</Typography>
                <Typography>{cmd.input}</Typography>
              </Box>
              <Box sx={{ 
                mt: 1, 
                color: cmd.status === 'error' ? '#ff6b6b' : '#fff',
                whiteSpace: 'pre-wrap'
              }}>
                {cmd.output}
              </Box>
            </Box>
          ))}
        </Box>

        <form onSubmit={executeCommand} style={{ display: 'flex', gap: '10px' }}>
          <TextField
            fullWidth
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Inserisci un comando Linux..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: '#444',
                },
                '&:hover fieldset': {
                  borderColor: '#666',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#888',
                },
              },
              '& .MuiInputBase-input': {
                fontFamily: 'monospace',
              }
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ 
              backgroundColor: '#444',
              '&:hover': {
                backgroundColor: '#666',
              }
            }}
          >
            Esegui
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Shell;