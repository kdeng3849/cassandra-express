const cassandra = require('cassandra-driver');
const express = require('express');
const fileType = require('file-type');
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

app.get('/retrieve', (req, res) => {
    var query = 'SELECT * FROM hw6.img WHERE filename=?'
    try {
        var filename = req.query.filename;
    }
    catch(error) {
        res.json(error);
    }
    
    client.execute(query, [filename])
        .then(result => {
            var blob = result.rows[0].contents;
            var contentType = fileType(blob)
            res.type(contentType.mime)
            res.end(blob);
        })
        .catch(error => {
            console.log(error)
            res.status(404);
        });
})

// const PORT = process.env.PORT || 5000
const PORT = process.env.PORT || 80
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})