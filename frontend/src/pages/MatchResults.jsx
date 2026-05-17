import React, { useState } from 'react';
import api from '../services/api';

const MatchResults = () => {
  const [jobReq, setJobReq] = useState({
    requiredSkills: '',
    preferredSkills: '',
    minExperience: ''
  });
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState({}); // track AI loading per candidate

  const handleMatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const reqPayload = {
        requiredSkills: jobReq.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        preferredSkills: jobReq.preferredSkills ? jobReq.preferredSkills.split(',').map(s => s.trim()).filter(s => s) : [],
        minExperience: Number(jobReq.minExperience) || 0
      };
      const res = await api.post('/match', reqPayload);
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to match candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleAiShortlist = async (candidateId) => {
    setAiLoading(prev => ({...prev, [candidateId]: true}));
    try {
      const reqPayload = {
        requiredSkills: jobReq.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        preferredSkills: jobReq.preferredSkills ? jobReq.preferredSkills.split(',').map(s => s.trim()).filter(s => s) : [],
        minExperience: Number(jobReq.minExperience) || 0
      };
      
      const res = await api.post('/ai/shortlist', {
        candidateId,
        jobRequirements: reqPayload
      });
      
      // Update result in state
      setResults(prevResults => prevResults.map(cand => {
        if(cand._id === candidateId) {
          return {
            ...cand,
            aiRecommendation: res.data.aiRecommendation,
            interviewQuestions: res.data.interviewQuestions
          };
        }
        return cand;
      }));
      
    } catch (err) {
      console.error(err);
      alert('AI Shortlisting failed. Check backend logs.');
    } finally {
      setAiLoading(prev => ({...prev, [candidateId]: false}));
    }
  };

  const getScoreClass = (score) => {
    if(score >= 80) return 'match-high';
    if(score >= 50) return 'match-medium';
    return 'match-low';
  };

  return (
    <div>
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2>Job Requirements</h2>
        <form onSubmit={handleMatch} style={{ marginTop: '1rem' }}>
          <div className="grid">
            <div className="form-group">
              <label>Required Skills (comma separated)</label>
              <input 
                type="text" 
                required 
                value={jobReq.requiredSkills}
                onChange={e => setJobReq({...jobReq, requiredSkills: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Preferred Skills (comma separated)</label>
              <input 
                type="text" 
                value={jobReq.preferredSkills}
                onChange={e => setJobReq({...jobReq, preferredSkills: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Min Experience (Years)</label>
              <input 
                type="number" 
                min="0"
                required
                value={jobReq.minExperience}
                onChange={e => setJobReq({...jobReq, minExperience: e.target.value})}
              />
            </div>
          </div>
          <button className="btn-gradient" type="submit" disabled={loading}>
            {loading ? 'Matching...' : 'Find Matches'}
          </button>
        </form>
      </div>

      {results.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Ranked Candidates</h2>
          <div className="grid">
            {results.map((cand) => (
              <div key={cand._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3>{cand.name}</h3>
                  <div className={`match-score ${getScoreClass(cand.matchScore)}`}>
                    {cand.matchScore}%
                  </div>
                </div>
                <p style={{ color: '#94a3b8', margin: '0.5rem 0' }}>Experience: {cand.experience} years</p>
                <div style={{ margin: '0.5rem 0' }}>
                  {cand.skills.map(s => <span key={s} className="badge">{s}</span>)}
                </div>
                
                {/* AI Section */}
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  {!cand.aiRecommendation && (
                    <button 
                      className="btn-gradient" 
                      style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      onClick={() => handleAiShortlist(cand._id)}
                      disabled={aiLoading[cand._id]}
                    >
                      {aiLoading[cand._id] ? 'AI Analyzing...' : 'AI Shortlist Analysis'}
                    </button>
                  )}
                  
                  {cand.aiRecommendation && (
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                      <h4 style={{ color: '#8b5cf6', marginBottom: '0.5rem' }}>🤖 AI Recommendation</h4>
                      <p style={{ fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem' }}>{cand.aiRecommendation}</p>
                      
                      {cand.interviewQuestions && cand.interviewQuestions.length > 0 && (
                        <>
                          <h4 style={{ color: '#3b82f6', marginBottom: '0.5rem' }}>🎯 Interview Questions</h4>
                          <ul style={{ fontSize: '0.85rem', paddingLeft: '1.2rem', color: '#cbd5e1' }}>
                            {cand.interviewQuestions.map((q, i) => (
                              <li key={i} style={{ marginBottom: '0.3rem' }}>{q}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchResults;
