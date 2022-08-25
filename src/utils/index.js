const {
    XMLParser,
    XMLBuilder,
    XMLValidator
} = require("fast-xml-parser")

const axios = require("axios")
const fs = require('fs');

const parser = new XMLParser();
const builder = new XMLBuilder();

const parsDate = (key, value) => {
    console.log(key, value)
    const date = new Date(value)
    if (date instanceof Date && !isNaN(date.getTime())) {
        return date
    }
    return value
}
const parseObjectProperties = (obj, parse) => {
    for (var k in obj) {
      if (typeof obj[k] === 'object' && obj[k] !== null) {
        parseObjectProperties(obj[k], parse)
      } else if (obj.hasOwnProperty(k)) {
        parse(k, obj[k])
      }
    }
  }

const utils = {
    getRSSFeed: async (uri) => {
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
    },
    parseXML: (data) => {
        if (!data) {
            return {
                error: "No RSS feed data provided",
                data: null
            }
        }
        const xml = parser.parse(data)
        parseObjectProperties(xml,parsDate)
        return {
            error: null,
            data: xml
        }
    },
    jsonToXml: (data) => {
        if (!data) {
            return {
                error: "No RSS feed data provided",
                data: null
            }
        }
        const xml = builder.build(data)
        return {
            error: null,
            data: xml
        }
    },
    sortBy: (arr, key, reverse) => {
        //check if array is array and not empty
        if (!Array.isArray(arr) || arr.length === 0 || !key) {
            return arr
        }

        return arr.sort((a, b) => {
            if (a[key] < b[key]) {
                return reverse ? 1 : -1
            }
            if (a[key] > b[key]) {
                return reverse ? -1 : 1
            }
            return 0
        });
    },
    exportToFile: async (data, format, path, filename) => {
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
        let writeData = ""
        let fileType = "json"

        format = format.toLowerCase()

        if (format === "json") {
            writeData = JSON.stringify(data)
        }
        if (format === "xml") {
            const {
                error,
                data: xml
            } = this.jsonToXml(data)
            if (error) {
                return {
                    error: error,
                    data: null
                }
            }
            writeData = xml
            fileType = "xml"
        }

        //check if folder exist if not create it
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }

        try {
            fs.writeFileSync(`${path}/${filename}.${fileType}`, writeData)
            return {
                error: null,
                data: data
            }
        } catch (error) {
            return {
                error: error.message,
                data: null
            }
        }
    }
}

module.exports = utils