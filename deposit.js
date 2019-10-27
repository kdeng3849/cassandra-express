// technically could have been in the index, but I'll leave this for the purposes of demonstrating express.Router

var express = require('express');
const cassandra = require('cassandra-driver');
const formidableMiddleware = require('express-formidable');
const fs = require('fs');

var router = express.Router();

router.use(express.json());
router.use(formidableMiddleware());

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1'});
client.connect(function(err, result) {
    console.log('cassandra connected');
})

router.post('', (req, res) => {
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
            res.json(result);
        })
        .catch(error => {
            console.log(error)
            res.status(404);
        });
})

// export this router to use in our index.js
module.exports = router;
