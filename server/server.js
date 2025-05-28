import './config/instrument.js'; // Importing the instrumentation configuration

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js';
import testRoute from './routes/test.js';

//initialize express app
const app = express();

//connect to database
await connectDB()

//middleware
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(cors());

// Remove or comment out the old `app.use(express.json())` if present
// app.use(express.json());


//routes
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});


app.use('/api', testRoute);

app.post('/webhooks',clerkWebhooks);

//port
const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

//start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});