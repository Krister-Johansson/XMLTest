const {
    XMLParser,
    XMLBuilder,
    XMLValidator
} = require("fast-xml-parser")

const axios = require("axios")
const fs = require('fs');

const parser = new XMLParser();
const builder = new XMLBuilder();

const getRSSFeed = async (uri) => {
    //validate uri
    if (!uri) {
        return {
            error: "No RSS feed URI provided",
            data: null
        }
    }
    // validate uri is a valid url
    if (!uri.match(/^(http|https):\/\/.*/)) {
        return {
            error: "Invalid RSS feed URI",
            data: null
        }
    }
    try {
        const {
            data
        } = await axios.get(uri)

        const validateXML = XMLValidator.validate(data);

        if(validateXML !== true){
            return {
                error: "Invalid RSS feed XML",
                data: null
            }
        }
        return {
            error: null,
            data
        }
    } catch (error) {
        return {
            error: error.message,
            data: null
        }
    }
};

const parseXML = (data) => {
    if (!data) {
        return {
            error: "No RSS feed data provided",
            data: null
        }
    }
    const xml = parser.parse(data)
    return {
        error: null,
        data: xml
    }
}

const jsonToXml = (data) => {
    if (!data) {
        return {
            error: "No RSS feed data provided",
            data: null
        }
    }

    const xmlData = `<?xml version="1.0" encoding="utf-8"?>${builder.build({rss:data.rss}, {format: true})}`.replace('<atom:link></atom:link>', '') //remove empty atom:link tag;
    return {
        error: null,
        data: xmlData
    }
}

const sortBy = (arr, key, reverse) => {
    //check if array is array and not empty
    if (!Array.isArray(arr) || arr.length === 0 || !key) {
        return arr
    }

    if (reverse === undefined) {
        reverse = false
    } else if (typeof reverse !== "boolean" && reverse === "true") {
        reverse = true
    } else if (typeof reverse !== "boolean" && reverse === "false") {
        reverse = false
    }

    arr.sort((a, b) => {
        // Check if keys are dates
        const date1 = new Date(a[key])
        const date2 = new Date(b[key])
        if (date1 instanceof Date && !isNaN(date1.getTime()) &&
            date2 instanceof Date && !isNaN(date2.getTime())) {

            return date1.getTime() - date1.getTime();
        } else {
            if (a[key] < b[key]) {
                return 1
            }
            if (a[key] > b[key]) {
                return -1
            }
            return 0
        }
    });
    if (reverse) {
        arr.reverse()
    }
    return arr
}

const exportToFile = async (data, format, path, filename) => {
    if (!data) {
        return {
            error: "No data provided",
            data: null
        }
    }
    if (!filename) {
        return {
            error: "No filename provided",
            data: null
        }
    }
    if (!path) {
        return {
            error: "No path provided",
            data: null
        }
    }
    if (!format) {
        return {
            error: "No format provided",
            data: null
        }
    }

    let fileType = ""

    format = format.toLowerCase()

    switch (format) {
        case "json":
            fileType = "json"
            
            break;
        case "xml":
            fileType = "xml"
            break;
    
        default:
            fileType = "txt"
            break;
    }

    //check if folder exist if not create it
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }

    try {
        const filePath = `${path}/${filename}.${fileType}`
        fs.writeFileSync(filePath, data)
        return {
            error: null,
            path: filePath,
            data: data
        }
    } catch (error) {
        return {
            error: error.message,
            data: null
        }
    }
}

const parsRssFeed = async (url, format, sortByKey, reverse) => {
    const feed = await getRSSFeed(url)
    if (feed.error) {
        return {
            error: feed.error,
            data: null
        }
    }

    let jsonXML = await parseXML(feed.data)
    if (jsonXML.error) {
        return {
            error: jsonXML.error,
            data: null
        }
    }

    if (jsonXML.data.rss.channel) {
        if (Array.isArray(jsonXML.data.rss.channel.item) &&
        jsonXML.data.rss.channel.item.length > 0 &&
            sortByKey &&
            jsonXML.data.rss.channel.item[0][sortByKey]
        ) {
            jsonXML.data.rss.channel.item = sortBy(jsonXML.data.rss.channel.item, sortByKey, reverse)
        }

        if (format === "json" || format === "web") {
            return {
                error: null,
                data: jsonXML.data
            }
        } else {
            const xmlData = jsonToXml(jsonXML.data)
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

module.exports = {
    getRSSFeed,
    parseXML,
    jsonToXml,
    sortBy,
    exportToFile,
    parsRssFeed
}