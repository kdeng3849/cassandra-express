const cassandra = require('cassandra-driver');
const express = require('express');
const formidable = require('formidable')
const path = require('path');

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1'});
client.connect(function(err, result) {
    console.log('cassandra connected');
})

// init express
const app = express();
app.use(express.json());
// app.use(express.urlencoded());
// app.use(express.urlencoded({extended: true})); 

var query = 'SELECT name, price_p_item FROM grocery.fruit_stock WHERE name=? ALLOW FILTERING';

// create your endpoints/route handlers
app.get('/', (req, res) => {
    // res.send('Hello World!');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/deposit', (req, res) => {
    // console.log(req.body)
    // res.json(req.body.filename)

    client.execute(query, ['oranges'], function(err, result) {
        if(err) {
            res.status(404).send({msg: err})
        }
        console.log(result)
        console.log(result.rows[0].price_p_item)
        res.json(result)
    })

    // new formidable.IncomingForm().parse(req, (err, fields, files) => {
    //     if (err) {
    //       console.error('Error', err)
    //       throw err
    //     }

    //     console.log('Fields', fields)
    //     console.log('Files', files)
    //     for (const file of Object.entries(files)) {
    //       console.log(file)

    //     var getAllImgs = 'SELECT * FROM hw6.img';
    //     // const query = 'SELECT name, email FROM users WHERE key = ?';
    //     client.execute(getAllImgs, [], function(err, result) {
    //         if(err) {
    //             res.status(404).send({msg: err})
    //         }
    //         console.log(result.rows.filename)
    //     })
        
    //     //   .then(result => console.log('User with email %s', result.rows[0].email));
    //         // .then(result => {
    //         //     console.log(result.rows)
    //         //     res.json(result.rows);
    //         // })
    //     }
    //     // res.end()
    // })
    
})


const PORT = process.env.PORT || 5000

// listen on a port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));