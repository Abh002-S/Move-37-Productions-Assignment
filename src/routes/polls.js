const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');

router.post('/', pollController.createPoll);
router.get('/:id', pollController.getPollWithResults);
router.post('/:pollId/vote', pollController.submitVote);

module.exports = router;