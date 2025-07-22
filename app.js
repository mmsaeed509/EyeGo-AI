const express = require('express');
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;


app.listen(port, () => {

  console.log(`Server running on port ${port}`);
  console.log(`check API response: http://localhost:${port}/eyego`);

});

app.get('/eyego', (request, response) => {

    const status = {
        "Status": "Running"
     };

    // response.send(status);
    response.send('Hello Eyego');
    
});
  