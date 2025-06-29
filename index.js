const express = require ('express');
const app = express();


const port = process.env.port || 3000;
const cors = require('cors');

const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome to the SmartParking Backend!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
