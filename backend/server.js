import dotenv from 'dotenv';
dotenv.config();
console.log("✅ Loaded ENV:", process.env.CLOUDINARY_API_KEY);
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import policeCaseRoutes from './routes/policeCaseRoutes.js';
import anonymousRoutes from './routes/anonymousRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import PublicChatMessage from './models/publicChatModel.js';
import informationRoute from './routes/informationRoute.js'
import PublicChatMessageRoutes from './routes/publicChatRoutes.js';
// import copNotesRoutes from './routes/copNotesRoutes.js';


const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.IO - Handle new client connections for chat
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  // Join a room and send its history
  socket.on("joinRoom", async (room) => {
    socket.join(room);
    console.log(`Client ${socket.id} joined room: ${room}`);

    try {
      const messages = await PublicChatMessage.find({ room }).sort({ createdAt: 1 }).limit(100);
      socket.emit("chatHistory", messages);
    } catch (err) {
      console.error("Error fetching chat history:", err);
    }
  });

  // Listen for new public messages
  socket.on("publicMessage", async (messageData) => {
    const { username, text, room } = messageData;

    try {
      console.log("Received public message in server.js");
      const newMessage = new PublicChatMessage({ username, text, room });
      await newMessage.save();

      // Broadcast the message to all clients in the same room
      io.to(room).emit("newPublicMessage", newMessage);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Middleware to attach io instance to requests (if needed in other parts)
app.use((req, res, next) => {
  req.io = io; 
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/cases', policeCaseRoutes);
app.use('/api/anonymous', anonymousRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/public-chat', PublicChatMessageRoutes);
app.use('/api/information', informationRoute); 
// app.use('/api/copNotes', copNotesRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export { io };

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
