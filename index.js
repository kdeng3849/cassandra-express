const cassandra = require('cassandra-driver');
const express = require('express');
const formidableMiddleware = require('express-formidable');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1'});
client.connect(function(err, result) {
    console.log('cassandra connected');
})

// init express
const app = express();

app.use(express.json());
app.use(formidableMiddleware());
app.use(morgan('common'));
// app.use(express.urlencoded());
// app.use(express.urlencoded({extended: true})); 


var query = 'SELECT name, price_p_item FROM grocery.fruit_stock WHERE name=? ALLOW FILTERING';

// create your endpoints/route handlers
app.get('/', (req, res) => {
    // res.send('Hello World!');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.post('/deposit', (req, res) => {
    var query = 'INSERT INTO hw6.img (filename, contents) VALUES (?, ?)';
    try {
        var filename = req.fields.filename;
        var file = fs.readFileSync(req.files.contents.path);
    }
    catch(error) {
        res.json(error);
    }

    client.execute(query, [filename, file], { traceQuery: true })
        .then(result => {
            // console.log(result);
            res.json(result);
        })
        .catch(error => res.status(404).send({ msg: error }));
})


const PORT = process.env.PORT || 5000

// listen on a port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));