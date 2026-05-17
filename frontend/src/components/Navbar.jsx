import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">AI Shortlister</Link>
      <div className="nav-links">
        <Link to="/candidates">Candidates</Link>
        <Link to="/add-candidate">Add Candidate</Link>
        <Link to="/match">Match & AI</Link>
      </div>
    </nav>
  );
};

export default Navbar;
