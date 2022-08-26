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

    const { error, data } = await utils.parsRssFeed(rssUri, format, sortBy, reverse)
    if (error) {
        return res.send(error)
    }
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