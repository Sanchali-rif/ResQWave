import logger from '../config/logger.js';

let ioInstance;

export const initSocket = (io) => {
  ioInstance = io;
  io.on('connection', (socket) => {
    logger.info(`Dashboard client connected: ${socket.id}`);
    socket.on('disconnect', () => {
      logger.info(`Dashboard client disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized");
  }
  return ioInstance;
};

export const emitToDashboard = (eventName, data) => {
  if (ioInstance) {
    ioInstance.emit(eventName, data);
  } else {
    logger.warn('Tried to emit Socket.io event but ioInstance is null');
  }
};
