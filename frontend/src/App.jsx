// frontend/src/App.jsx

import { useState } from 'react';
import axios from 'axios';
import './App.css';
import React from 'react';

// An object to hold our agent configurations
const agents = {
  guide: { 
    name: "The Guide",
    port: 8000, 
    prompt: "Analyze with The Guide"
  },

  challenger: { 
    name: "The Challenger",
    port: 8001,
    prompt: "Challenge with The Challenger"
  }
};

function App() {
  const [entry, setEntry] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // New state to track the currently selected agent
  const [selectedAgent, setSelectedAgent] = useState('guide');

  const handleAnalyze = async () => {
    if (!entry) {
      alert("Please write something in your journal.");
      return;
    }
    setIsLoading(true);
    setResponse('');

    // Get the port and name for the selected agent
    const agentConfig = agents[selectedAgent];
    const port = agentConfig.port;

    try {
      // The URL is now built dynamically based on the selected agent's port
      const result = await axios.post(`http://127.0.0.1:${port}/analyze/${selectedAgent}`, {
        text: entry
      });
      setResponse(result.data.response);
    } catch (error) {
      console.error("Error fetching analysis:", error);
      setResponse(`Sorry, something went wrong. Are the Docker containers running?`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MindScribe Pro</h1>
        <p>Your AI-powered journaling companion</p>
      </header>
      <main>
        <textarea
          className="journal-input"
          rows="10"
          placeholder="Write your thoughts here..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />

        <div className="agent-selector">
          <p>Choose your AI assistant:</p>
          <button 
            className={selectedAgent === 'guide' ? 'active' : ''}
            onClick={() => setSelectedAgent('guide')}
          >
            The Guide
          </button>
          <button 
            className={selectedAgent === 'challenger' ? 'active' : ''}
            onClick={() => setSelectedAgent('challenger')}
          >
            The Challenger
          </button>
        </div>

        <button className="analyze-button" onClick={handleAnalyze} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : agents[selectedAgent].prompt}
        </button>
        
        {response && (
          <div className="response-box">
            <p><strong>{agents[selectedAgent].name} says:</strong></p>
            <p>{response}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;