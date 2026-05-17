const Candidate = require('../models/Candidate');

// Get all candidates
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
};

// Add a new candidate
exports.addCandidate = async (req, res) => {
  try {
    const { name, email, skills, experience, bio } = req.body;
    if (!name || !email || !skills || experience === undefined) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const candidate = new Candidate({
      name,
      email,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
      experience,
      bio
    });

    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
       return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to add candidate' });
  }
};

// Delete a candidate
exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    await Candidate.findByIdAndDelete(id);
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
};

// Match candidates
exports.matchCandidates = async (req, res) => {
  try {
    const { requiredSkills, preferredSkills, minExperience } = req.body;
    
    if (!requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ error: 'requiredSkills array is required' });
    }

    const candidates = await Candidate.find();
    
    // Normalize skills
    const reqSkillsNorm = requiredSkills.map(s => s.toLowerCase().trim());
    const prefSkillsNorm = preferredSkills ? preferredSkills.map(s => s.toLowerCase().trim()) : [];
    
    const matchedCandidates = candidates.map(candidate => {
      const candSkills = candidate.skills.map(s => s.toLowerCase().trim());
      
      let reqMatchCount = 0;
      reqSkillsNorm.forEach(rs => {
        if (candSkills.includes(rs)) reqMatchCount++;
      });
      
      let prefMatchCount = 0;
      prefSkillsNorm.forEach(ps => {
        if (candSkills.includes(ps)) prefMatchCount++;
      });

      // Calculate score out of 100
      // 70% weight to required skills, 20% to preferred, 10% to experience
      const reqScore = reqSkillsNorm.length > 0 ? (reqMatchCount / reqSkillsNorm.length) * 70 : 70;
      const prefScore = prefSkillsNorm.length > 0 ? (prefMatchCount / prefSkillsNorm.length) * 20 : 20;
      
      let expScore = 0;
      if (candidate.experience >= minExperience) {
        expScore = 10;
      } else {
        // partial score
        expScore = Math.max(0, (candidate.experience / (minExperience || 1)) * 10);
      }

      const totalScore = Math.round(reqScore + prefScore + expScore);
      
      return {
        ...candidate.toObject(),
        matchScore: totalScore
      };
    });

    // Sort descending by matchScore
    matchedCandidates.sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchedCandidates);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to match candidates' });
  }
};
