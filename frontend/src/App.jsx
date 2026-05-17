import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CandidateList from './pages/CandidateList';
import CandidateForm from './pages/CandidateForm';
import MatchResults from './pages/MatchResults';

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/candidates" element={<CandidateList />} />
          <Route path="/add-candidate" element={<CandidateForm />} />
          <Route path="/match" element={<MatchResults />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
