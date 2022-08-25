const express = require('express')
const utils = require("./utils")

const app = express()
const port = 3000

const fetchRssFeed = async (url, format, sortBy, reverse) => {
    const feed = await utils.getRSSFeed(url)
    if (feed.error) {
        return {
            error: feed.error,
            data: null
        }
    }
    
    let xml = await utils.parseXML(feed.data)
    if (xml.error) {
        return {
            error: xml.error,
            data: null
        }
    }
    if (xml.data.rss.channel) {
        if (Array.isArray(xml.data.rss.channel.item)
        && xml.data.rss.channel.item.length > 0
        && sortBy
        && xml.data.rss.channel.item[0][sortBy]
        && reverse)
        {
            xml.data.rss.channel.item = utils.sortBy(xml.data.rss.channel.item, sortBy, reverse)
        }

        if (format === "json") {
            return {
                error: null,
                data: xml.data
            }
        } else {
            const xmlData = utils.jsonToXml(xml.data)
            if (xmlData.error) {
                return {
                    error: xmlData.error,
                    data: null
                }
            }
            return {
                error: null,
                data: xmlData.data
            }
        }
    }
    return {
        error: "No RSS feed data found",
        data: null
    }
}


app.get('/', async (req, res) => {
    let {
        rssUri,
        format,
        sortBy,
        reverse
    } = req.query

    if(reverse === undefined){
        reverse = false
    }else if(reverse === "true"){
        reverse = true
    }else{
        reverse = false
    }

    const {
        error,
        data
    } = await fetchRssFeed(rssUri, format, sortBy, reverse)
    if (error) {
        return res.send(error)
    }
    res.send(data)
})

app.listen(port, () => {
    console.log(`App running on port http://127.0.0.1:${port}?rssUri=https://news.un.org/feed/subscribe/en/news/region/europe/feed/rss.xml`)
})

const init = async () => {
    const feed = await utils.getRSSFeed("https://news.un.org/feed/subscribe/en/news/region/europe/feed/rss.xml")
    const {
        data,
        error
    } = await utils.parseXML(feed.data)

    if (data.rss.channel.item) {
        data.rss.channel.item = utils.sortBy(data.rss.channel.item, "pubDate", false)

        const saveFile = await utils.exportToFile(data, "json", "./data", "data")
        console.log(saveFile)
    }
}

// (async () => {
//     await init();
// })();
