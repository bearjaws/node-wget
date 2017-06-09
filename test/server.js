const crypto = require('crypto');
const express = require('express');

const app = express();
let size = 1024 * 1024;
let file = new Buffer(size);
crypto.randomBytes(size, function(err, buffer) {
    file = buffer;
});
app.get('/file', function (req, res) {
    res.send(file);
});

app.get('/file/metadata', function (req, res) {
    let hash = crypto.createHash('sha256').update(file).digest('hex');
    res.json({
        'size': size,
        'hash': hash
    })
});

module.exports = async function() {
    return new Promise((resolve, reject) => {
        app.listen(8884, function () {
            console.log('listening');
            resolve();
        });
    });

};