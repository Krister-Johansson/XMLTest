const utils = require("../utils")
const app = require("./web")

const exportToFile = async (rssUri, format, path, fileName, sortBy, reverse) => {
    const rssFeed = await utils.parsRssFeed(rssUri, format, sortBy, reverse)
    let data = rssFeed.map((feed) => {
       
        if (feed.error) {
            console.log(feed.error)
            return
        }
        return feed.data
    });
    if(format === "xml"){
        data = data.toString();
    }

    const file = await utils.exportToFile(data, format, path, fileName)
    if (file.error) {
        return {
            error: file.error
        }
    }
    return {
        error: null,
        path: file.path,
        data: file.data
    }
}

const exportToConsole = async (rssUri, format, sortBy, reverse) => {
    return await utils.parsRssFeed(rssUri, format, sortBy, reverse) 
}

module.exports = {
    exportToFile,
    exportToConsole,
    app
}