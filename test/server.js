const crypto = require('crypto');
const express = require('express');
const http = require('http');

const app = express();
let size = 1024 * 1024;
let file = new Buffer(size);
crypto.randomBytes(size, function(err, buffer) {
    file = buffer;
});
app.get('/file', function (req, res) {
    res.send(file);
});
app.get('/file/noSizeHeader', function (req, res) {
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
            http.createServer( (request, response) => {
                response.writeHead(200, {
                    'Content-Type': 'binary',
                });
                response.write(new Buffer(858478).toString('hex'));
                response.end();
            }).listen(9933);
            console.log('listening');
            resolve();
        });
    });

};