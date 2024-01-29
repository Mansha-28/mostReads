const express = require('express')
const https = require('https');
const cheerio = require('cheerio');

const app = express()

const port = 8000

app.get('/', (req, res) => {
    res.send('Extracting the top 6 stories with title and link from time.com')
})


function fetchTimeHTML(callback) {
    https.get('https://time.com', (res) => {
        let data = '';

        console.log(data)

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            callback(data);
        });

    }).on('error', (err) => {
        console.log('Error:', err.message);
    });
}

app.get('/getTimeStories', (req, res) => {
    fetchTimeHTML((html) => {
        const $ = cheerio.load(html);
        const stories = [];
        
        $('a.most-popular-feed__item-section').each((index, element) => {
            if (index < 6) {
                stories.push({
                    title: $(element).text(),
                    link: $(element).attr('href')
                });
            }
        });

        res.json(stories);
    });
});

app.listen(port, (req, res) => {
    console.log(`app is listing on the port ${port}`)
})