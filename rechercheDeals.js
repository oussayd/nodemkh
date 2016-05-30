var http = require('http');
var request = require('request');
var parser = require("number-parsing");
var fs = require("fs");
var format = require("string-template");
var compile = require("string-template/compile");
var cheerio = require('cheerio');
var RECONDITIONNE = require('./utils/reconditionne.js');
var NOUVEAU = require('./utils/nouveau.js');

var commun = require('./utils/commun.js');


var searchList = RECONDITIONNE.DE;
var numeroDeal = 0;

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
    stock: Number,
    reduction: Number,
    reductionGlobale: Number,
    img: String,
    lastUpdate: Date,
    version: Number
});

var lienInfo;
//var lienInfo = LIENS.WAREHOUSE.FR.INFORMATIQUE;
var dealsUrl = "http://www.amazon.fr/s/ref=sr_pg_{0}?fst=as%3Aoff&rh=n%3A8873224031%2Cn%3A206617031&page={0}&bbn=8873224031&sort=price-desc-rank";
var lastPage = false;
var indexLien = 0;
var links = [];
var _categorie = "";
var pageIndex;
for (var key in searchList) {
    if (searchList.hasOwnProperty(key)) {
        links.push(searchList[key]);
    }
}

var recherchePrix = function (indexL) {

    lienInfo = links[indexL];

    var dealsUrlTemlate = compile(lienInfo.LINK);

    var urlInfo = commun.getUrlInfos(dealsUrlTemlate(1));
    var baseUrl = commun.baseUrlTemplate(urlInfo.locale);

    console.log(urlInfo);
    pageIndex = 1;

    searchLoop(pageIndex, urlInfo, baseUrl, lienInfo, dealsUrlTemlate);


};

var searchLoop = function (pageIndex, urlInfo, baseUrl, lienInfo, dealsUrlTemlate) {
    console.log("+++++++++++++++++++++++ Page " + pageIndex + " +++++++++++++++++++++++");

    var url = dealsUrlTemlate(pageIndex);
    console.log("[" + lienInfo.CATEGORIE + "] Page URL : " + url);
    scrapPricesFromPage(url, urlInfo, baseUrl, lienInfo);
    setTimeout(function () {
        pageIndex++;
        if (!lastPage && pageIndex < 401) {
            searchLoop(pageIndex, urlInfo, baseUrl, lienInfo, dealsUrlTemlate);
        } else {
            console.log("!!!!!!!!!!!!!!!!!!!!!!! LastPage " + pageIndex + " !!!!!!!!!!!!!!!!!!!!!!");
            indexLien++;

            if (indexLien < links.length) {

                lastPage = false;
                console.log("//////////////////////////// Passage à la categorie " + links[indexLien].CATEGORIE + " ////////////////////////////");

                recherchePrix(indexLien);
            } else {
                console.log("//+++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                console.log("//+++++++++++++++++++++++++++++++++++++++++++++++++++++++");

                console.log("//+++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                console.log("//+++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                console.log("////////////////////// ////// THE END ////////////////////////////");
                console.log("//+++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                console.log("//+++++++++++++++++++++++++++++++++++++++++++++++++++++++");

                console.log("//+++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                console.log("//+++++++++++++++++++++++++++++++++++++++++++++++++++++++");

            }

        }
    }, 10000);
};

var scrapPricesFromPage = function (_url, urlInfo, baseUrl, lienInfo) {

    var options = {
        url: _url,
        headers: {
            'User-Agent':
            //'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36'

                'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0'
        }
    };
    request(_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            //console.log(body);
            // fs.writeFile('retour.html', body);
            $ = cheerio.load(body);


            lastPage = ($("#noResultsTitle").html() != undefined && $("#noResultsTitle").html().length > 0);
            /*

                        if (pageIndex === 1) {
                            _categorie = $("div[id='wayfinding-breadcrumbs_feature_div']").children().children().first().find('a').text().trim();
                            console.log(_categorie);
                        }
            */


            $("li[id^='result']").each(function (i, elem) {
                numeroDeal++;
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
                if (prix > 0 && prix < 10000) {
                    console.log(numeroDeal + " - " + asin + " : " + prix);




                    /*
                    
                    //*[@id="wayfinding-breadcrumbs_feature_div"]/ul/li[1]/span/a
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
                            //categorie: _categorie,
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
                        getLocalPrices(asin, locale, urlInfo, prix, numeroDeal);
                    });

                }
            });

        } else {
            console.log(error);
            //  lastPage = true;
        }

    });
}
var getLocalPrices = function (asin, locale, urlInfo, prixDeal, numeroDeal) {

    //if (locale.pays !== urlInfo.locale) {

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
                    } else if (deal != null) {

                        prix = commun.parsePrice(price[1], locale);
                        reduction = 100 * prixDeal / prix;
                        reduction = reduction.toFixed(2);

                        if (locale.pays === urlInfo.locale) {

                            deal.reduction = reduction;
                            $ = cheerio.load(body);
                            var stock = $("#availability span").html();
                            if (stock != undefined && stock.trim().match(/\d+/) > 0) {
                                deal.stock = stock.trim().match(/\d+/)[0];
                                console.log(deal.stock);
                            }
                        } else if (!!deal && (!deal.reductionGlobale || reduction < deal.reductionGlobale)) {
                            deal.reductionGlobale = reduction;
                        }

                        deal.prixLocaux[locale.pays.replace('.', '')] = prix;

                        console.log(numeroDeal + " - " + commun.articleUrlTemplate(locale.pays, asin) + " prix : " + prix + " prixLocal : " + prixDeal + " reduction : " + reduction + " reductionGlobale : " + deal.reductionGlobale);
                        deal.save();
                    }
                });

            //  
        }

    });
    // }
};

recherchePrix(indexLien);