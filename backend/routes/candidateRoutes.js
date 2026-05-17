const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

router.get('/', candidateController.getCandidates);
router.post('/', candidateController.addCandidate);
router.delete('/:id', candidateController.deleteCandidate);
// Note: We also put match here as defined in server.js fallback or we can use it on root /api/match
router.post('/match', candidateController.matchCandidates);

module.exports = router;
