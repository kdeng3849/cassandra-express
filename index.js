const cassandra = require('cassandra-driver');
const express = require('express');
const formidableMiddleware = require('express-formidable');
const path = require('path');

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1'});
client.connect(function(err, result) {
    console.log('cassandra connected');
})

// init express
const app = express();

app.use(express.json());
app.use(formidableMiddleware());
// app.use(express.urlencoded());
// app.use(express.urlencoded({extended: true})); 


var query = 'SELECT name, price_p_item FROM grocery.fruit_stock WHERE name=? ALLOW FILTERING';

// create your endpoints/route handlers
app.get('/', (req, res) => {
    // res.send('Hello World!');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.post('/deposit', (req, res) => {

    console.log("fields:", req.fields);
    console.log("files:", req.files['contents']);
    // res.end();

    var filename = req.fields.filename;
    var file = req.files.contents;

    var query = 'INSERT INTO hw6.img(filename, contents) VALUES(?, ?)';
    client.execute(query, [filename, file], { prepare: true }, function(err, result) {
        if(err) {
            res.status(404).send({msg: err})
        }
        else
            res.json({status: 'OK'})
        // console.log(result)
        // console.log(result)
        // console.log(result.rows)
        // res.json(result.rows[0])
    })
})


const PORT = process.env.PORT || 5000

// listen on a port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));