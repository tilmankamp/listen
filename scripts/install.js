const request = require('request');
const requestjson = require('request-json')
const ProgressBar = require('progress');
const tar = require('tar-fs')
const zlib = require('zlib')
const fs = require('fs')
const path = require('path')
const extract = require('extract-zip')

const downloadLatestAndUnzip = (user, repo, what, re, dir, takeFirst) => {
    return new Promise((resolve, reject) => {
        var client = requestjson.createClient('https://api.github.com/');
        client.get(`repos/${user}/${repo}/releases/latest`, (err, res, release) => {
            release.assets.forEach(asset => {
                asset_url = asset.browser_download_url
                if(re.test(asset_url)) {
                    console.log(`Downloading ${what} from ${asset_url}...`)
                    download = request
                        .get({
                            followAllRedirects: true,
                            url: asset_url
                        })
                    if (asset_url.endsWith('.tar.gz')) {
                        download
                            .pipe(zlib.createUnzip())
                            .pipe(tar.extract(dir))
                    } else {
                        filename = path.join(dir, asset_url.split('/').slice(-1)[0])
                        download
                            .pipe(fs.createWriteStream(filename))
                    }
                    download
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
                            reject(err)
                        })
                        .on('end', resolve)
                }
            })
        })
    })
}

var maryRegEx = /marytts-5.*\.zip/
var dataDir = path.resolve('./data')
downloadLatestAndUnzip('marytts', 'marytts', 'MaryTTS 5', maryRegEx, './data').then(result => {
    zipName = fs.readdirSync(dataDir).find(f => maryRegEx.test(f))
    archive = path.join(dataDir, zipName)
    extract(archive, { dir: dataDir }, err => {
        if(err) {
            console.log(err)
            return
        }
        var dir_old = path.join(dataDir, zipName.substring(0, zipName.length - 4))
        var dir_new = path.join(dataDir, 'marytts')
        fs.renameSync(dir_old, dir_new)
        fs.unlinkSync(archive)
        downloadLatestAndUnzip('mozilla', 'DeepSpeech', 'latest model', /models.*\.tar\.gz/, './data').then(() => {
            console.log('Downloaded all resources.')
        })
    })
})











