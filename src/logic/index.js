const utils = require("../utils")
const app = require("./web")

const exportToFile = async (rssUri, format, path, fileName, sortBy, reverse) => {
    const rssFeed = await utils.parsRssFeed(rssUri, format, sortBy, reverse)
    if (rssFeed.error) {
        return {
            error: rssFeed.error
        }
    }
    const file = await utils.exportToFile(rssFeed.data, format, path, fileName)
    if (file.error) {
        return {
            error: file.error
        }
    }
    return {
        error: null,
        data: file.data
    }
}

const exportToConsole = async (rssUri, format, sortBy, reverse) => {
    const rssFeed = await utils.parsRssFeed(rssUri, format, sortBy, reverse)
    if (rssFeed.error) {
        return {
            error: rssFeed.error
        }
    }

    return {
        error: null,
        data: rssFeed.data
    }
}

module.exports = {
    exportToFile,
    exportToConsole,
    app
}