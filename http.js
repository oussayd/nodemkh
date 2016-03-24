var http = require('http');
var request = require('request');
var parser = require("number-parsing");
var fs = require("fs");
var format = require("string-template");
var compile = require("string-template/compile");
var cheerio = require('cheerio');


var urlTemplate = compile("http://www.amazon.{0}/dp/{1}");

var bebeUrlTemplate = compile("http://www.amazon.fr/s/ref=sr_pg_{0}?fst=as%3Aoff&rh=n%3A8873224031%2Cn%3A206617031&page={0}&bbn=8873224031&sort=price-desc-rank");

var asinList = ['B001RIYRB2', 'B017GXAQ2A', 'B00ZRUJVJY'];
var locale = ['fr', 'de', 'it', 'co.uk'];

var pageIndex = 1;
var lastPage = false;
var articles = {};
while (!lastPage && pageIndex < 2) {

    var url = bebeUrlTemplate(pageIndex);

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            // fs.writeFile('retour.html', body);
            $ = cheerio.load(body);
            fs.writeFile('retour.htm', $('#atfResults').html());
            $("li[id^='result']").each(function (i, elem) {

                asin = $(this).attr('data-asin');
                prix = $(this).find($('.a-color-price')).text();
                titre = $(this).find($('h2')).text();
                imgUrl = $(this).find($('img')).attr('src');
                console.log(asin + " - " + prix + " - " + imgUrl + " - " + titre);
                articles[asin] = {
                    prixRec: prix,
                    titre: titre,
                    imgUrl: imgUrl,
                    prix: {
                        it: '',
                        fr: '',
                        'co.uk': '',
                        'de': ''
                    }
                };

                locale.forEach(function (locale) {
                    getPrice(asin, locale);
                });

            });
            //  console.log($('.a-color-price').text());

            /*var regex = /[nb]\s*?id="priceblock_[\w]*?price".*?>(.*?)</img;
            var price = regex.exec(body);
            if (price == null || price.length != 2) {
                console.log("pageScraper.warning.unavailable");
                return;
            }
            console.log(index + " +  asin : " + asin + " +  locale : " + locale + " price : " + price[1]);*/
        } else {
            lastPage = true;
        }

    });


    pageIndex++;

}
/*asinList.forEach(function (asin, asinIndex, asinArray) {
    locale.forEach(function (locale) {
        getPrice(asin, locale)
    });
});*/

function getPrice(asin, locale) {

    request(urlTemplate(locale, asin), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var regex = /[nb]\s*?id="priceblock_[\w]*?price".*?>(.*?)</img;
            var price = regex.exec(body);
            if (price == null || price.length != 2) {
                return;
            }
            articles[asin].prix[locale] = price[1];
            console.log("asin : " + asin + " +  locale : " + locale + " price : " + price[1]);
        }

    });
};


setTimeout(function () {
    console.log(JSON.stringify(articles, null, 4));
}, 15000);