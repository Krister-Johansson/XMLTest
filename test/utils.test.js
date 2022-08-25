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