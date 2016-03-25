var http = require('http');
var request = require('request');
var parser = require("number-parsing");
var fs = require("fs");
var format = require("string-template");
var compile = require("string-template/compile");
var cheerio = require('cheerio');

var mongoose = require('mongoose');
// mongoose for mongodb
mongoose.connect('mongodb://localhost:27017/amazon'); // connect to mongoDB database on modulus.io

// define model =================

var baseUrl = 'http://www.amazon.fr/gp/offer-listing/';

/*var PrixLocal = new Schema({
    locale: String,
    prix: Number
});*/

var Article = mongoose.model('Deal', {
    titre: String,
    asin: String,
    categorie: String,
    pays: String,
    url: String,
    prix: Number,
    prixLocaux: [{
        locale: String,
        prix: Number
}],
    indice: Number,
    img: String,
    lastUpdate: Date,
    version: Number
});

var urlTemplate = compile("http://www.amazon.{0}/dp/{1}");

var bebeUrlTemplate = compile("http://www.amazon.fr/s/ref=sr_pg_{0}?fst=as%3Aoff&rh=n%3A8873224031%2Cn%3A206617031&page={0}&bbn=8873224031&sort=price-desc-rank");

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
                titre = $(this).find($('h2')).text();
                imgUrl = $(this).find($('img')).attr('src');


                prix = -1;
                prixString = $(this).find($('.a-color-price')).text();
                if (prixString) {
                    prix = parsePrice(prixString, {
                        pays: 'fr',
                        taux: 1
                    });
                }


                console.log(asin + " - " + prix + " - " + imgUrl + " - " + titre);
                articles[asin] = {
                    prixRec: prix,
                    titre: titre,
                    imgUrl: imgUrl,
                    prix: {}
                };


/*
                Article.findOne({
                    asin: asin,
                    pays: 'fr',
                    prix: prix
                }, function (err, article) {


                    if (!article) {*/
                        Article.update({
                                asin: asin,
                                pays: 'fr'
                            }, {
                                titre: titre,
                                asin: asin,
                                /*
                                                                categorie: _cible.CATEGORIE,
                                */
                                pays: 'fr',
                                url: baseUrl + asin + '/',
                                prix: prix,
                                /*
                                                                indice: -1,
                                */
                                img: imgUrl,
                                lastUpdate: Date.now(),
                                $inc: {
                                    version: 1
                                },
                            }, {
                                upsert: true
                            },
                            function (err, article) {
                                if (err)
                                    console.log(err);

                            });
/*
                    }
                    });*/

                locale.forEach(function (locale) {
                    getLocalPrices(asin, locale);
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

var getLocalPrices = function (asin, locale) {

    request(urlTemplate(locale.pays, asin), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var regex = /[nb]\s*?id="priceblock_[\w]*?price".*?>(.*?)</img;
            var price = regex.exec(body);
            if (price == null || price.length != 2) {
                return;
            }
            prix = parsePrice(price[1], locale);
            articles[asin].prix[locale.pays] = prix;

            Article.update({
                    asin: asin,
                    pays: 'fr'
                }, {
                    $push: {
                        "prixLocaux": {
                            "locale": locale.pays,
                            "prix": prix
                        }
                    }
                }, {
                    upsert: true
                },
                function (err, article) {
                    if (err)
                        console.log(err);

                });
            console.log("asin : " + asin + " +  locale : " + locale.pays + " price : " + prix);
        }

    });
};

var parsePrice = function (stringPrice, locale) {
    prix = -1;

    if (locale.pays === 'co.uk') {
        prix = parser(stringPrice.replace(/[^\d^,^.]/g, ''), {
            us: 0.75,
            fr: 0.25
        }) * locale.taux;
    } else {
        prix = parser(stringPrice.replace(/[^\d^,^.]/g, ''));

    }

    return prix;
}
/*setTimeout(function () {
    console.log(JSON.stringify(articles, null, 4));
}, 15000);*/