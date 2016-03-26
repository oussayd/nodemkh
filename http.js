var http = require('http');
var request = require('request');
var parser = require("number-parsing");
var fs = require("fs");
var format = require("string-template");
var compile = require("string-template/compile");
var cheerio = require('cheerio');
var LIENS = require('./utils/liens.js');
var commun = require('./utils/commun.js');

var mongoose = require('mongoose');
// mongoose for mongodb
mongoose.connect('mongodb://localhost:27017/amazon'); // connect to mongoDB database on modulus.io

var Deal = mongoose.model('Deal', {
    titre: String,
    asin: String,
    categorie: String,
    pays: String,
    url: String,
    prix: Number,
    prixLocaux: {
        'it': Number,
        'fr': Number,
        'de': Number,
        'couk': Number

    },
    reduction: Number,
    reductionGlobale: Number,
    img: String,
    lastUpdate: Date,
    version: Number
});

var lienInfo = LIENS.WAREHOUSE.DE.BEBE;
var dealsUrl = "http://www.amazon.fr/s/ref=sr_pg_{0}?fst=as%3Aoff&rh=n%3A8873224031%2Cn%3A206617031&page={0}&bbn=8873224031&sort=price-desc-rank";
var lastPage = false;
var recherchePrix = function (lien) {

    var dealsUrlTemlate = compile(lienInfo.LINK);

    var urlInfo = commun.getUrlInfos(dealsUrlTemlate(1));
    var baseUrl = commun.baseUrlTemplate(urlInfo.locale);

    console.log(urlInfo);
    var pageIndex = 1;

    searchLoop(pageIndex, urlInfo, baseUrl, lienInfo, dealsUrlTemlate);


};

var searchLoop = function (pageIndex, urlInfo, baseUrl, lienInfo, dealsUrlTemlate) {
    console.log(pageIndex + " " + lastPage);
    var url = dealsUrlTemlate(pageIndex);
    console.log("---------------------page : " + pageIndex + " url " + url);
    scrapPricesFromPage(url, urlInfo, baseUrl, lienInfo);
    setTimeout(function () {
        pageIndex++;
        if (!lastPage && pageIndex < 401) {
            searchLoop(pageIndex, urlInfo, baseUrl, lienInfo, dealsUrlTemlate);
        } else {
            console.log("LastPage " + pageIndex);
        }
    }, 4000);
};

var scrapPricesFromPage = function (_url, urlInfo, baseUrl, lienInfo) {

    request(_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            // fs.writeFile('retour.html', body);
            $ = cheerio.load(body);



            $("li[id^='result']").each(function (i, elem) {
                asin = $(this).attr('data-asin');
                titre = $(this).find($('h2')).text();
                imgUrl = $(this).find($('img')).attr('src');
                prix = -1;
                prixString = $(this).find($('.a-color-price')).text();
                if (prixString) {
                    prix = commun.parsePrice(prixString, {
                        pays: urlInfo.locale,
                        taux: 1.3
                    });
                }

                console.log(asin + " - " + prix);




                /*
                                Deal.findOne({
                                    asin: asin,
                                    pays: urlInfo.locale,
                                    prix: prix
                                }, function (err, deal) {


                                    if (!deal) {
                */
                Deal.update({
                        asin: asin,
                        pays: urlInfo.locale
                    }, {
                        titre: titre,
                        asin: asin,
                        categorie: lienInfo.CATEGORIE,
                        pays: urlInfo.locale,
                        url: baseUrl + asin + '/',
                        prix: prix,
                        img: imgUrl,
                        lastUpdate: Date.now(),
                        $inc: {
                            version: 1
                        },
                    }, {
                        upsert: true
                    },
                    function (err, deal) {
                        if (err)
                            console.log(err);

                    });

                /*                  }

                });
*/

                commun.locale.forEach(function (locale) {
                    getLocalPrices(asin, locale, urlInfo, prix);
                });

            });

        } else {
            console.log(error);
            //  lastPage = true;
        }

    });
}
var getLocalPrices = function (asin, locale, urlInfo, prixDeal) {

    request(commun.articleUrlTemplate(locale.pays, asin), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var regex = /[nb]\s*?id="priceblock_[\w]*?price".*?>(.*?)</img;
            var price = regex.exec(body);
            if (price == null || price.length != 2) {
                return;
            }


            Deal.findOne({
                    "asin": asin,
                    "pays": urlInfo.locale
                },
                function (err, deal) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("-----Updating : " + deal.asin);
                        prix = commun.parsePrice(price[1], locale);
                        reduction = 100 * (prix - prixDeal) / prix;
                        reduction = reduction.toFixed(2);

                        if (locale.pays === urlInfo.locale) {
                            deal.reduction = reduction;
                        }
                        if (!deal.reductionGlobale || reduction < deal.reductionGlobale) {
                            deal.reductionGlobale = reduction;
                        }

                        deal.prixLocaux[locale.pays.replace('.', '')] = prix;

                        console.log("-----Updating : " + deal.asin + " +  locale : " + locale.pays + " price : " + prix);
                        deal.save();
                    }
                });

            //  
        }

    });
};

recherchePrix(dealsUrl);