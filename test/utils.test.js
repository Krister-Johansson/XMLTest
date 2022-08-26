const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();

const utils = require('../src/utils');

describe('Get RSS feed', () => {
    it('should return data', async () => {
        const feed = await utils.getRSSFeed("https://blog.risingstack.com/feed/")
        expect(feed.error).to.equal(null);
        expect(feed.data).to.not.equal(null);
    }).timeout(5000);

    it('should FAIL return data', async () => {
        const feed = await utils.getRSSFeed("blog.risingstack.com/feed/")
        expect(feed.error).to.not.equal(null);
        expect(feed.data).to.equal(null);
        expect(feed.error).to.equal("Invalid RSS feed URI");
    }).timeout(5000);

    it('should FAIL URI', async () => {
        const feed = await utils.getRSSFeed("")
        expect(feed.error).to.not.equal(null);
        expect(feed.data).to.equal(null);
        expect(feed.error).to.equal("No RSS feed URI provided");
    }).timeout(5000);
}).timeout(5000);

describe('Parse XML', () => {
    it('should return data', async () => {
        const feed = await utils.getRSSFeed("https://blog.risingstack.com/feed/")
        const xml = await utils.parseXML(feed.data)

        expect(xml.error).to.equal(null);
        expect(xml.data).to.not.equal(null);
        expect(xml.data).to.have.property('rss');

    }).timeout(5000);
}).timeout(5000);




describe("Sort items", () => {
    it("shuld sort title reverse", async () => {
        const items = await utils.sortBy(arr, "title", true)
        expect(items[0].title).to.equal(arr[0].title);
    });
    it("shuld sort title", async () => {
        const items = await utils.sortBy(arr, "title", false)
        expect(items[0].title).to.equal(arr[0].title);
    });
    it("shuld sort date reverse", async () => {
        const items = await utils.sortBy(arr, "pubDate", true)
        expect(items[0].pubDate).to.equal(arr[0].pubDate);
    });
    it("shuld sort date", async () => {
        const items = await utils.sortBy(arr, "pubDate", false)
        expect(items[0].pubDate).to.equal(arr[0].pubDate);
    });
})


const arr = [{
        id: 1,
        title: "All is good",
        link: "https://news.un.org/feed/view/en/story/2022/08/1125392",
        description: "UN agencies and entities have underlined their continued support to Ukraine, as Wednesday marked six months since the start of the war devastating the country. ",
        enclosure: "",
        guid: "https://news.un.org/feed/view/en/story/2022/08/1125392",
        pubDate: "Wed, 24 Aug 2022 17:43:04 -0400",
        source: ""
    },
    {
        id: 2,
        title: "This is a test",
        link: "https://news.un.org/feed/view/en/story/2022/08/1125392",
        description: "UN agencies and entities have underlined their continued support to Ukraine, as Wednesday marked six months since the start of the war devastating the country. ",
        enclosure: "",
        guid: "https://news.un.org/feed/view/en/story/2022/08/1125392",
        pubDate: "Wed, 25 Aug 2022 17:43:04 -0400",
        source: ""
    }
]