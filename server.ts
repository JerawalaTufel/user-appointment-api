import express  from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
// Create Express server
const app = express();

// Define a route handler for the root path
const port = process.env.PORT || 5000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
