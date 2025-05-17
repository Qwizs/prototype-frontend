import { Server } from "socket.io";

const io = new Server(3000, {
    cors: { origin: '*' },
  });
  
  let quizzes = {};
  
  io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');
  
    socket.on('joinLobby', ({ roomCode }) => {
      if (!quizzes[roomCode]) {
        quizzes[roomCode] = { players: [] };
      }
      quizzes[roomCode].players.push(socket.id);
      io.emit('playerJoined', socket.id);
    });
  
    socket.on('startQuiz', ({ roomCode }) => {
      io.emit('quizStarted', { roomCode });
    });
  
    socket.on('disconnect', () => {
      console.log('Un utilisateur s\'est déconnecté');
    });
  });
  