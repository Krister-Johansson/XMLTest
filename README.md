node ./src/index.js --output=web

node ./src/index.js --output=console --order=tilte --format=json --reverse=true

node ./src/index.js --output=console --feedURI=https://news.un.org/feed/subscribe/en/news/region/europe/feed/rss.xml\;https://www.jnytt.se/feeds/feed.xml --order=tilte --format=json


node ./src/index.js --output=file --feedURI=https://news.un.org/feed/subscribe/en/news/region/europe/feed/rss.xml\;https://www.jnytt.se/feeds/feed.xml --order=tilte --format=xml --fileName=asd --path=data