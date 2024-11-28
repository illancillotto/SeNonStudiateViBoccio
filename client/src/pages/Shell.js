import React, { useState } from 'react';
import axios from 'axios';

function Shell() {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState([]);

  const executeCommand = async () => {
    try {
      const response = await axios.post('/api/shell/execute', { command });
      setOutput([...output, { command, result: response.data.output }]);
      setCommand('');
    } catch (error) {
      console.error('Error executing command:', error);
    }
  };

  return (
    <div className="shell-container">
      <div className="shell-output">
        {output.map((item, index) => (
          <div key={index}>
            <div>$ {item.command}</div>
            <div>{item.result}</div>
          </div>
        ))}
      </div>
      <div className="shell-input">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
          placeholder="Enter command..."
        />
      </div>
    </div>
  );
}

export default Shell;