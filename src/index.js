const logic = require("./logic")

let output = null;
let feedURI = null;
let reverse = null;
let format = null;
let sortBy = null;
let fileName = null
let path = null
let port = 3000

process.argv.forEach(element => {
    console.log(element)
    if(element.includes("--output=")){
        output = element.split("=")[1]
    }
    if(element.includes("--feedURI=")){
        feedURI = element.split("=")[1]
    }
    if(element.includes("--sortBy=")){
        sortBy = element.split("=")[1]
    }
    if(element.includes("--format=")){
        format = element.split("=")[1]
    }
    if(element.includes("--reverse=")){
        reverse = element.split("=")[1]
    }
    if(element.includes("--fileName=")){
        fileName = element.split("=")[1]
    }
    if(element.includes("--path=")){
        path = element.split("=")[1]
    }
    if(element.includes("--port=")){
        port = element.split("=")[1]
    }
});

if(output === "file"){
    logic.exportToFile(feedURI, format, path, fileName, sortBy, reverse)
        .then(result => {
            if(result.error){
                console.log(result.error)
            }else{
                console.log(result.path)
            }
        }).catch(error => {
            console.log(error)
        }
    )
}

if(output === "console"){
    logic.exportToConsole(feedURI, format, sortBy, reverse).then(result => {
        console.log(result)
    }).catch(error => {
        console.log(error)
    })
}

if(output === "web"){
    logic.app.app.listen(port, () => {
        console.log(`App running on port http://127.0.0.1:${port}?rssUri=https://www.jnytt.se/feeds/feed.xml&format=${format}&sortBy=${sortBy}&reverse=${reverse}`)
    })
}