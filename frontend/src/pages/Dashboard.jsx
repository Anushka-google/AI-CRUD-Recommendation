import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>AI Candidate Shortlisting System</h1>
      <p style={{ color: '#cbd5e1', fontSize: '1.2rem', marginBottom: '3rem' }}>
        Store, analyze, and intelligently shortlist candidates using the power of OpenRouter AI.
      </p>
      
      <div className="grid">
        <div className="glass-card">
          <h2>Manage Candidates</h2>
          <p style={{ margin: '1rem 0', color: '#94a3b8' }}>View and manage the talent pool.</p>
          <Link to="/candidates">
            <button className="btn-gradient">View Candidates</button>
          </Link>
        </div>
        
        <div className="glass-card">
          <h2>Add Talent</h2>
          <p style={{ margin: '1rem 0', color: '#94a3b8' }}>Manually add a new candidate profile.</p>
          <Link to="/add-candidate">
            <button className="btn-gradient">Add Candidate</button>
          </Link>
        </div>
        
        <div className="glass-card">
          <h2>AI Match & Shortlist</h2>
          <p style={{ margin: '1rem 0', color: '#94a3b8' }}>Find the perfect fit with AI analysis.</p>
          <Link to="/match">
            <button className="btn-gradient">Start Matching</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
