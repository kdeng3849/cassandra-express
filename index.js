const cassandra = require('cassandra-driver');
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('common'));

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1'});
client.connect(function(err, result) {
    console.log('cassandra connected');
})

var deposit = require('./deposit.js');
app.use('/deposit', deposit);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.post('/retrieve', (req, res) => {
    var query = 'SELECT * FROM hw6.img WHERE filename=?'
    try {
        var filename = req.body.filename;
    }
    catch(error) {
        res.json(error);
    }
    
    client.execute(query, [filename])
        .then(result => {
            var blob = result.rows[0].contents;
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end(blob);
        })
        .catch(error => {
            console.log(error)
            res.status(404);
        });
})

// app.post('/deposit', (req, res) => {
//     var query = 'INSERT INTO hw6.img (filename, contents) VALUES (?, ?)';
//     try {
//         var filename = req.fields.filename;
//         var file = fs.readFileSync(req.files.contents.path);
//     }
//     catch(error) {
//         res.json(error);
//     }

//     client.execute(query, [filename, file], { traceQuery: true })
//         .then(result => {
//             res.json(result);
//         })
//         .catch(error => res.status(404).send({ msg: error }));
// })

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})