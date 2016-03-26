var http = require('http');
var request = require('request');
var parser = require("number-parsing");
var fs = require("fs");
var format = require("string-template");
var compile = require("string-template/compile");
var cheerio = require('cheerio');

var locale = [{
    pays: 'fr',
    taux: 1
}, {
    pays: 'de',
    taux: 1
}, {
    pays: 'it',
    taux: 1
}, {
    pays: 'co.uk',
    taux: 1.3
}];

var getUrlInfos = function (_url) {
    domain = extractDomain(_url);
    locale = domain.replace("www.amazon.", "");
    return {
        'domain': domain,
        'locale': locale
    };
};

var extractDomain = function (_url) {
    var domain;
    if (_url.indexOf("://") > -1) {
        domain = _url.split('/')[2];
    } else {
        domain = _url.split('/')[0];
    }
    //find & remove port number
    domain = domain.split(':')[0];
    return domain;
}

var parsePrice = function (stringPrice, locale) {
    prix = -1;

    if (locale.pays === 'co.uk') {
        prix = parser(stringPrice.replace(/[^\d^,^.]/g, ''), {
            us: 0.75,
            fr: 0.25
        }) * 1.3;
    } else {
        prix = parser(stringPrice.replace(/[^\d^,^.]/g, ''));

    }

    return prix.toFixed(2);
};

var articleUrlTemplate = compile("http://www.amazon.{0}/dp/{1}");
var baseUrlTemplate = compile('http://www.amazon.{0}/gp/offer-listing/');


exports.getUrlInfos = getUrlInfos;
exports.extractDomain = extractDomain;
exports.locale = locale;
exports.parsePrice = parsePrice;
exports.articleUrlTemplate = articleUrlTemplate;
exports.baseUrlTemplate = baseUrlTemplate;