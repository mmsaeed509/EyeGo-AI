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
  console.log(`check API response: http://localhost:${PORT}/eyego`);

});

// define API endpoint
app.get('/eyego', (request, response) => {

    // define response
    const status = {
        "Status": "Running"
     };

    // response.send(status);
    response.send('Hello Eyego');
    
});
  