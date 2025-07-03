const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config();

const pollRoutes = require('./routes/pollRoutes');
const userRoutes = require('./routes/userRoutes');
const Poll = require('./models/poll');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
app.use(cors());
app.use(express.json());

app.use('/api/polls', pollRoutes);
app.use('/api/users', userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('vote', async ({ pollId, optionId }) => {
    console.log('Vote received:', { pollId, optionId });
    const pollDoc = await Poll.findById(pollId);
    if (!pollDoc) {
      console.error('Poll not found:', pollId);
      return;
    }
    pollDoc.options[optionId].votes += 1;
    await pollDoc.save();
    const updatedVotes = pollDoc.options[optionId].votes;

    io.emit('vote-update', { pollId, optionId, votes: updatedVotes });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
