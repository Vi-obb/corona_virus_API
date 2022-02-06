// packages

const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

// arrays to store scraped data

const newsSources = [
    {
        name: 'my joy Online',
        address: 'https://www.myjoyonline.com/tag/coronavirus/'
    },
    {
        name: 'the guardian',
        address: 'https://www.theguardian.com/world/coronavirus-outbreak'
    },
    {
        name: 'forbes',
        address: 'https://www.forbes.com/coronavirus/?sh=64613b2120dd'
    },
    {
        name: 'daily guide',
        address: 'https://dailyguidenetwork.com/category/health/corona-virus-pandemic/'
    },
    {
        name: 'huffington post',
        address: 'https://www.huffpost.com/news/topic/coronavirus'
    }
];

const articles = [];



// function to scrape data from each news source

newsSources.forEach(newsSource => {
    axios.get(newsSource.address)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('a:contains("Covid-19")', html).each(function () {
                const title = $(this).text();
                const link = $(this).attr('href');

                articles.push({
                    title,
                    link,
                    source: newsSource.name
                })
            })
        })

})




// routes

app.get('/', (req, res) => {
    res.json('Welcome to my Coronavirus news scraper API!');
});

app.get('/news', (req, res) => {
    res.json(articles);
})

app.get('/news/:sourceId', (req, res) => {
    const sourceId = req.params.sourceId

    const newsAddress = newsSources.filter(source => source.name == sourceId)[0].address;

    axios.get(newsAddress)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const specificArticles = [];

            $('a:contains("Covid-19")', html).each(function () {
                const title = $(this).text();
                const link = $(this).attr('href');

                specificArticles.push({
                    title,
                    link,
                    source: sourceId
                })
            })
            res.json(specificArticles);
        }).catch(err => {
            console.log(err);
        })
})



app.listen(PORT, () => console.log(`Listening on port ${PORT}`));