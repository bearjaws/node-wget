let crypto = require('crypto');
let fs = require('fs');
let expect = require('chai').expect;
let request = require('request');

let wget = require('../lib/wget');

let baseHTTP = 'http://localhost:8884';
let metadata = {};
before(async function() {
   let server = require('./server');
   await server();
   await request(baseHTTP + '/file/metadata', function(err, res, body) {
       metadata = JSON.parse(body);
   });
});

describe("Download Tests", function() {
    // with a proxy:
    it("Should be able to download a file", function(done) {
        let download = wget.download('http://localhost:8884/file', '/tmp/wget-test-file.bin');
        download.on('error', function(err) {
            console.log(err);
            expect(err).to.be.null;
            done();
        });
        download.on('start', function(fileSize) {
            expect(fileSize).to.be.a('number');
            expect(fileSize).to.equal(metadata.size);
        });
        download.on('end', async function(output) {
            let file = await fs.readFileSync('/tmp/wget-test-file.bin');
            let hash = crypto.createHash('sha256').update(file).digest('hex');
            expect(output).to.equal('Finished writing to disk');
            expect(hash).to.equal(metadata.hash);
            done();
        });
        download.on('progress', function(progress) {
            expect(progress).to.be.above(0);
            expect(progress).to.be.below(1.00000000000001);
        });
    });

    it("Should handle a server that does not have content-length header", function(done) {
        let download = wget.download('http://localhost:9933/', '/tmp/wget-bs-test.bin');
        download.on('error', function(err) {
            console.log(err);
            expect(err).to.be.null;
            done();
        });
        download.on('start', function(fileSize) {
            expect(fileSize).to.be.null;
        });
        download.on('progress', function(progress) {
            expect(progress).to.be.above(0);
            expect(progress).to.be.below(1.00000000000001);
        });

        download.on('end', function() {
            done();
        });
    });

    it("Should not append to the previous file.", function(done) {
        let download = wget.download('http://localhost:8884/file', '/tmp/wget-test-file.bin');
        download.on('error', function(err) {
            console.log(err);
            expect(err).to.be.null;
            done();
        });
        download.on('end', async function(output) {
            let file = await fs.readFileSync('/tmp/wget-test-file.bin');
            let hash = crypto.createHash('sha256').update(file).digest('hex');
            expect(output).to.equal('Finished writing to disk');
            expect(hash).to.equal(metadata.hash);
            done();
        });
    });
});