const prisma = require('../lib/prisma');

async function createPoll(req, res) {
  try {
    const { question, options, creatorId, isPublished = false } = req.body;
    if (!question || !Array.isArray(options) || options.length < 2 || !creatorId) {
      return res.status(400).json({ error: 'invalid payload' });
    }

    const poll = await prisma.poll.create({
      data: {
        question,
        isPublished,
        creator: { connect: { id: creatorId } },
        pollOptions: { create: options.map(text => ({ text })) }
      },
      include: { pollOptions: true }
    });

    res.status(201).json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
}

async function getPollWithResults(req, res) {
  try {
    const id = Number(req.params.id);
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        pollOptions: {
          include: { votes: { select: { id: true } } }
        },
        creator: { select: { id: true, name: true, email: true } }
      }
    });

    if (!poll) return res.status(404).json({ error: 'not found' });

    const optionsWithCounts = poll.pollOptions.map(opt => ({
      id: opt.id,
      text: opt.text,
      votes: opt.votes.length
    }));

    res.json({
      id: poll.id,
      question: poll.question,
      isPublished: poll.isPublished,
      creator: poll.creator,
      options: optionsWithCounts,
      createdAt: poll.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
}

async function submitVote(req, res) {
  const io = req.app.get('io');
  try {
    const pollId = Number(req.params.pollId);
    const { userId, pollOptionId } = req.body;
    if (!userId || !pollOptionId) return res.status(400).json({ error: 'missing fields' });

    const option = await prisma.pollOption.findUnique({ where: { id: Number(pollOptionId) } });
    if (!option || option.pollId !== pollId) return res.status(400).json({ error: 'invalid option' });

    const existing = await prisma.vote.findFirst({
      where: { userId: Number(userId), pollId }
    });
    if (existing) return res.status(409).json({ error: 'user already voted for this poll' });

    await prisma.vote.create({
      data: {
        user: { connect: { id: Number(userId) } },
        poll: { connect: { id: pollId } },
        pollOption: { connect: { id: Number(pollOptionId) } }
      }
    });

    const results = await getPollResults(pollId);
    const room = `poll:${pollId}`;
    io.to(room).emit('poll_update', { pollId, results });

    res.status(201).json({ pollId, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
}

async function getPollResults(pollId) {
  const options = await prisma.pollOption.findMany({
    where: { pollId },
    include: { votes: { select: { id: true } } }
  });
  return options.map(o => ({ optionId: o.id, text: o.text, votes: o.votes.length }));
}

module.exports = { createPoll, getPollWithResults, submitVote };