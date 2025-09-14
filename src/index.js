require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');

const usersRouter = require('./routes/users');
const pollsRouter = require('./routes/polls');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', usersRouter);
app.use('/api/polls', pollsRouter);
app.get('/health', (req, res) => res.json({ ok: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('socket connected:', socket.id);

  socket.on('join_poll', (pollId) => {
    const room = `poll:${pollId}`;
    socket.join(room);
    console.log(`socket ${socket.id} joined ${room}`);
  });

  socket.on('leave_poll', (pollId) => {
    const room = `poll:${pollId}`;
    socket.leave(room);
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected:', socket.id);
  });
});

app.set('io', io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
