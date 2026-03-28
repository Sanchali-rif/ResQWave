import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './config/logger.js';
import { initSocket } from './services/socket.js';
import dotenv from 'dotenv';
dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Initialize Socket.io
initSocket(io);

// Connect to Database
connectDB();

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
