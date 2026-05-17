const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/shortlist', aiController.shortlistCandidate);

module.exports = router;
