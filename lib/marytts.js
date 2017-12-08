const jre = require('node-jre')
const path = require('path')
const child_process = require('child_process')

var exports = module.exports = {}

function MaryTTS() {
}

MaryTTS.prototype.start = function() {
}

module.exports = MaryTTS

var javaArgs = [
    '-Dmary.base=' + path.resolve('./data/marytts'),
    '-Xms40m',
    '-Xmx1g',
    '-Dsocket.port=54321'
]

child_process.spawn(
    jre.driver(),
    javaArgs.concat(jre.getArgs(
        [
            'data/marytts/lib/marytts-runtime-5.2-jar-with-dependencies.jar',
            'data/marytts/lib/marytts-lang-en-5.2.jar'
        ],
        'marytts.server.Mary'
    ))
)

//process.kill()