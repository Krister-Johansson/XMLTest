const express = require('express')
const utils = require("../utils")

const app = express()

app.set('views', __dirname + '/../views');
app.set('view engine', 'pug')

app.get('/', async(req, res) => {
    let {
        rssUri,
        format,
        sortBy,
        reverse
    } = req.query
    const result = await utils.parsRssFeed(rssUri, format, sortBy, reverse)
    const data = result.map((feed) => {
        if (feed.error) {
            return res.send(error)
        }
        return feed.data
    });
   console.log(data)
    if(format === "web"){
        return res.render('index', {data, rssUri,
            format,
            sortBy,
            reverse})
    }

    if(format === "json") {
        res.header("Content-Type", "application/json");
    }else if(format === "xml") {
        res.header("Content-Type", "application/xml");
    }else {
        res.header("Content-Type", "text/plain");
    }

    return res.status(200).send(data);
})

module.exports = {
    app
}