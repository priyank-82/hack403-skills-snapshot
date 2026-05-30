import React from 'react';
import AIEndpoints from '../components/AIEndpoints';
import '../styles/pages/AI.css';

// Only send user input to the backend, do not use any mock or static data
const sendQueryToGroq = async (prompt) => {
  try {
    const response = await fetch('http://localhost:8000/groq/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: prompt,
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    console.log('Groq API response:', data);
    return data; // This should be { reply: "..." }
  } catch (error) {
    console.error('Error in sendQueryToGroq:', error);
    return { reply: 'No response from AI (error occurred).' };
  }
};

// The rest of the component should not use any mock or static data

export default function AI() {
  return (
    <div className="ai-page">
      <AIEndpoints sendQueryToGroq={sendQueryToGroq} />
    </div>
  );
}
