import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT ?? 3000;


// Middleware
app.use(express.json());
app.use(cors());
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);


// Маршрут: отримати всі нотатки
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

// Маршрут: отримати одну нотатку за ID
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;

  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// Тестовий маршрут помилки
app.get('/test-error', (_req, _res) => {
  throw new Error('Simulated server error');
});

// Middleware 404 (після всіх маршрутів)
app.use((_req, res) => {
 res.status(404).json({ message: 'Route not found' });
});


// Middleware для обробки помилок
app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({ message: 'Something went wrong. Please try again later.' });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
