const request = require('request');
const requestjson = require('request-json')
const ProgressBar = require('progress');
const tar = require('tar-fs')
const zlib = require('zlib')

var client = requestjson.createClient('https://api.github.com/');

client.get('repos/mozilla/DeepSpeech/releases/latest', (err, res, release) => {
    release.assets.forEach(asset => {
        asset_url = asset.browser_download_url
        if(/models.*\.tar\.gz/.test(asset_url)) {
            console.log("Downloading most recent English model from: ", asset_url);
            request
                .get({
                    followAllRedirects: true,
                    url: asset_url
                })
                .on('response', res => {
                    var len = parseInt(res.headers['content-length'], 10);
                    var bar = new ProgressBar('Progress: [:bar] :percent :etas', {
                        complete: '=',
                        incomplete: ' ',
                        width: 80,
                        total: len
                    });
                    res.on('data', chunk => bar.tick(chunk.length));
                })
                .on('error', err => {
                    console.log(`Problem downloading the model: ${err.message}`);
                })
                .pipe(zlib.createUnzip())
                .pipe(tar.extract('./data'))
        }
    })
})









