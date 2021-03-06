const { Chromeless } = require('chromeless')

var baseUrl = process.env.OPBEANS_BASE_URL || 'http://www.opbeans.com';
var url = baseUrl

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function run() {
    const chromeless = new Chromeless({
        lauchChrome: true
    })

    for (; ;) {
        try {
            url = await chromeless
                .goto(url)
                .evaluate(baseUrl => {
                // activateLoadGeneration is defined in opbeans-frontend
                if (typeof window.activateLoadGeneration === 'function') {
                    console.log('Activating route change load generation')
                    window.activateLoadGeneration()
                }

                var links = document.querySelectorAll('a[href^="/"]')
                if (links && links.length) {
                    var i = Math.floor(Math.random() * links.length)
                    return links[i].href
                } else {
                    return baseUrl
                }
            }, baseUrl);
        } catch (e) {
            // this will catch the error, log it and let the process continue
            console.error(`Error occurred while evaluating ${url}:`, e)
        }
        console.log(url)
        await sleep(8000 + Math.floor(Math.random() * 10000))
    }
}

run().catch(console.error.bind(console))
