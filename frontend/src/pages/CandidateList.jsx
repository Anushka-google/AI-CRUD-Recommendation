import React, { useEffect, useState } from 'react';
import api from '../services/api';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await api.get('/candidates');
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/candidates/${id}`);
        fetchCandidates();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Candidate Pool</h2>
      <div className="grid">
        {candidates.length === 0 && <p>No candidates found. Add some!</p>}
        {candidates.map(cand => (
          <div key={cand._id} className="glass-card">
            <h3>{cand.name}</h3>
            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>{cand.email}</p>
            <div style={{ marginBottom: '1rem' }}>
              {cand.skills.map(s => <span key={s} className="badge">{s}</span>)}
            </div>
            <p style={{ marginBottom: '1rem' }}><strong>Experience:</strong> {cand.experience} years</p>
            {cand.bio && <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>{cand.bio}</p>}
            <button className="btn-danger" onClick={() => handleDelete(cand._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateList;
