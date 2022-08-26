node ./src/index.js --output=web
node ./src/index.js --output=file --feedURI=https://news.un.org/feed/subscribe/en/news/region/europe/feed/rss.xml --order=tilte
node ./src/index.js --output=console --order=tilte --format=json --reverse=true