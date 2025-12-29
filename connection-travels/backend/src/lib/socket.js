const { Server } = require('socket.io');

let io;

function initSocket(httpServer, corsOrigins) {
  io = new Server(httpServer, {
    cors: {
      origin: corsOrigins,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    const { role, ownerId } = socket.handshake.query;
    if (role === 'owner' && ownerId) {
      socket.join(`owner:${ownerId}`);
    }
    if (role === 'admin') {
      socket.join('admins');
    }
    if (role === 'user') {
      socket.join('users');
    }

    socket.on('disconnect', () => {
      socket.removeAllListeners();
    });
  });

  return io;
}

function getIo() {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
}

function emitToOwners(ownerId, event, payload) {
  if (!io) return;
  io.to(`owner:${ownerId}`).emit(event, payload);
}

function emitToAdmins(event, payload) {
  if (!io) return;
  io.to('admins').emit(event, payload);
}

function emitToUsers(event, payload) {
  if (!io) return;
  io.to('users').emit(event, payload);
}

module.exports = {
  initSocket,
  getIo,
  emitToOwners,
  emitToAdmins,
  emitToUsers,
};
