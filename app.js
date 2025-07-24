// import express
const express = require('express');
// create express app
const app = express();
// parse requests with JSON payloads
app.use(express.json());

// define port 
const PORT = process.env.PORT || 3000;

// listen for requests
app.listen(PORT, () => {
  // log server status
  console.log(`Server running on port ${PORT}`);
  console.log(`Check API response:`);
  console.log(`- Root endpoint: http://localhost:${PORT}/`);
  console.log(`- Eyego endpoint: http://localhost:${PORT}/eyego`);
});

// define root endpoint
app.get('/', (req, res) => {
  res.send('Hello Eyego');
});

// define /eyego endpoint
app.get('/eyego', (req, res) => {
  res.send('Hello Eyego from eyego endpoint');
});
