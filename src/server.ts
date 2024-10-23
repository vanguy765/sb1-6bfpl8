import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const punycode = require('punycode');
console.log('Punycode version:', punycode.version);
import dotenv from 'dotenv';
import conversationRoutes from './routes/conversation.js';
import { sequelize } from './config/database.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/conversation', conversationRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
