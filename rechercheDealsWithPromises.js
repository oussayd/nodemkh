var http = require('http');
var request = require('request');
var parser = require("number-parsing");
var fs = require("fs");
var format = require("string-template");
var compile = require("string-template/compile");
var cheerio = require('cheerio');
var RECONDITIONNE = require('./utils/reconditionne.js');
var NOUVEAU = require('./utils/nouveau.js');
var nodemailer = require('nodemailer');
var Q = require('q');
var commun = require('./utils/commun.js');


var TIMEOUT = 600000;
var prixLimite = 10000;
var compareLocalPrices = true;
//var searchList = NOUVEAU.FLASH;
//var searchList = RECONDITIONNE.TOP;
//var searchList = RECONDITIONNE.TOP_DE;

var searchList = RECONDITIONNE.BARRES_TOIT;
//var searchList = RECONDITIONNE.ONDULEUR;
//var searchList = RECONDITIONNE.SKI;
//var searchList = RECONDITIONNE.PS4;
//var searchList = RECONDITIONNE.COFFRE;
//var searchList = RECONDITIONNE.RAPIDE;
//var searchList = RECONDITIONNE.DE;
//var searchList = NOUVEAU.SOLDES;
// var searchList = NOUVEAU.FR;

var numeroDeal = 0;
var emailDealList = [];
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

var NewDeal = mongoose.model('NewDeal', {
    titre: String,
    asin: String,
    categorie: String,
    lowestPriceNew: Number,
    lowestPaysNew: String,
    lowestPriceRec: Number,
    lowestPaysRec: String,
    reductionGlobale: Number,
    prixMoyenNeuf: Number,
    prixRec: {
        'it': Number,
        'fr': Number,
        'de': Number,
        'couk': Number
    },
    prixNeuf: {
        'it': Number,
        'fr': Number,
        'de': Number,
        'couk': Number
    },
    reductionRec: {
        'it': Number,
        'fr': Number,
        'de': Number,
        'couk': Number
    },
    reductionNeuf: {
        'it': Number,
        'fr': Number,
        'de': Number,
        'couk': Number
    },
    stock: {
        'it': Number,
        'fr': Number,
        'de': Number,
        'couk': Number
    },
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

var transporter = nodemailer.createTransport({
    host: 'mail.gmx.com',
    port: 587,
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    },
    //   logger: true, // log to console
    // debug: true, // include SMTP traffic in the logs
    // debug: true, // include SMTP traffic in the logs

    // define proxy configuration
    service: 'Gmx',
    auth: {
        user: 'oussayd@gmx.com', // Your email id
        pass: 'rafhaj14' // Your password
    }
});

/*var transporter = nodemailer.createTransport({
 host: 'mail.gmx.com',
 port: 587,
 tls: {
 ciphers: 'SSLv3',
 rejectUnauthorized: false
 },
 //   logger: true, // log to console
 // debug: true, // include SMTP traffic in the logs
 // debug: true, // include SMTP traffic in the logs

 // define proxy configuration
 service: 'Gmx',
 auth: {
 user: 'mohamed.khaireddine@gmail.com', // Your email id
 pass: 'ktbJD9!!*+7*' // Your password
 }
 });*/

/*
 var transporter = nodemailer.createTransport('smtps://mohamed.khaireddine%40gmail.com:ktbJD9!!*+7*@smtp.gmail.com');
 */

var sendMail = function (deal) {

    var mailOptions = {
        from: 'oussayd@gmx.com', // sender address
        // from: 'mohamed.khaireddine@gmail.com',
        to: 'oussayd@gmail.com,maryamnjimi@gmail.com', // list of receivers
        subject: '[Deal][' + deal.categorie + '][' + deal.pays + '] - R=' + deal.reductionGlobale + '% P=' + deal.prix + '€ : ' + deal.titre, // Subject line
        html: ' <h2 > <a href="' + deal.url + '" target="_blank">' + deal.titre + '  </a></h2><table><tr><td>    <a href="' + deal.url + '" target="_blank"> <img style="width:100px;height:100px;" src="' + deal.img + '"></a>  </td>  <td >' + deal.prix + '</td> <td >' + deal.stock + '</td><td>' + deal.reduction + '</td>   <td > ' + deal.reductionGlobale + '</td> <td style="color:blue;" >' + deal.prixLocaux.fr + '</td><td style="color:red;" >' + deal.prixLocaux.couk + '</td><td> <b>' + deal.prixLocaux.de + '</b></td><td style="color:green;" >' + deal.prixLocaux.it + '</td></tr></table>'


    };


    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);

        } else {
            console.log('Message sent: ' + info.response);

        }
        ;
    });

};
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
    }, TIMEOUT);
};

var promiseDealElmnt = function (parameters) {
    console.log("promiseDealElmnt -  (" + parameters.index + "," + parameters.urlInfo + "," + parameters.baseUrl);
    var index = parameters.index;
    var foundDeals = parameters.foundDeals;
    var urlInfo = parameters.urlInfo;
    var baseUrl = parameters.baseUrl;
    var deferred = Q.defer();
    if (index < foundDeals.length) {
        var deal = foundDeals[index];
        console.log(index);
        index++;
        parameters.index = index;
        numeroDeal++;
        asin = $(deal).attr('data-asin');
        titre = $(deal).find($('h2')).text();
        imgUrl = $(deal).find($('img')).attr('src');

        prix = -1;
        prixString = $(deal).find($('.a-color-price')).text();
        if (prixString) {
            prix = commun.parsePrice(prixString, {
                pays: urlInfo.locale,
                taux: 1.3
            });
        }
        console.log(numeroDeal + " - " + asin + " : " + prix);

        if (prix > 0 && prix < 10000) {
            console.log(numeroDeal + " - " + asin + " : " + prix);

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
                    }
                }, {
                    upsert: true
                },
                function (err, deal) {
                    if (err)
                        console.log(err);

                });


            if (compareLocalPrices) {
                if (prix <= prixLimite) {
                    getLocalPrices({
                        "asin": asin,
                        "localeList": commun.locale,
                        "localeIndex": 0,
                        "urlInfo": urlInfo,
                        "prixDeal": prix,
                        "numeroDeal": numeroDeal
                    })
                        .then(getLocalPrices)
                        .then(getLocalPrices)
                        .then(getLocalPrices).then(
                        function () {
                            if (index < foundDeals.length) {
                                setTimeout(function () {
                                    promiseDealElmnt(parameters).then(function () {
                                        deferred.resolve(parameters);
                                    });
                                }, 1000);
                            } else {
                                deferred.resolve(parameters);
                            }
                        }
                    );

                }
            }

        } else {
            if (index < foundDeals.length) {
                setTimeout(function () {
                    promiseDealElmnt(parameters).then(function () {
                        deferred.resolve(parameters);
                    });
                }, 1000);
            } else {
                deferred.resolve(parameters);
            }
        }

    }
    return deferred.promise;

};
var scrapPricesFromPage = function (_url, urlInfo, baseUrl, lienInfo) {

    var options = {
        url: _url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36'
            //    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
            // 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0'
        }
    };

    request(_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            $ = cheerio.load(body);

            lastPage = ($("#noResultsTitle").html() != undefined && $("#noResultsTitle").html().length > 0) || ($("div.proceedWarning").html() != undefined && $("div.proceedWarning").html().length > 0);
            var title = $("title").text();
            var foundDeals = $("li[id^='result']");
            console.log(title + " - " + foundDeals.length);
            promiseDealElmnt({index: 0, foundDeals: foundDeals, urlInfo: urlInfo, baseUrl: baseUrl}).then(function () {
                console.log("then end")
            });
            /*
             foundDeals.each(function (i, elem) {
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

             if (compareLocalPrices) {
             if (prix <= prixLimite) {
             getLocalPrices(asin, commun.locale["fr"], urlInfo, prix, numeroDeal)
             .then(getLocalPrices(asin, commun.locale["de"], urlInfo, prix, numeroDeal))
             .then(getLocalPrices(asin, commun.locale["it"], urlInfo, prix, numeroDeal))
             .then(getLocalPrices(asin, commun.locale["co.uk"], urlInfo, prix, numeroDeal));

             }
             }

             }

             });
             */
        } else {
            console.log(error);
        }

    });
};
var getLocalPrices = function (parameters) {
        var asin = parameters.asin;
        var localeList = parameters.localeList;
        var localeIndex = parameters.localeIndex;
        var urlInfo = parameters.urlInfo;
        var prixDeal = parameters.prixDeal;
        var numeroDeal = parameters.numeroDeal;

        var deferred = Q.defer();
        if (localeIndex < localeList.length) {
            var locale = localeList[localeIndex];
            parameters.localeIndex++;
            console.log("asin : " + asin + " locale : " + locale.pays);
            //if (locale.pays !== urlInfo.locale) {

            request(commun.articleUrlTemplate(locale.pays, asin), function (error, response, body) {


                    if (!error && response.statusCode == 200) {

                        var regex = /[nb]\s*?id="priceblock_[\w]*?price".*?>(.*?)</img;
                        var price = regex.exec(body);
                        if (price == null || price.length != 2) {
                            console.log("error " + price);
                            deferred.resolve(parameters);

                        } else {

                            console.log("asin : " + asin + " locale : " + locale.pays + " prix : " + price[1]);

                            Deal.findOne({
                                    "asin": asin,
                                    "pays": urlInfo.locale
                                },
                                function (err, deal) {
                                    if (err) {
                                        console.log(err);
                                    } else if (deal != null) {
                                        console.log("Deal found asin : " + asin + " locale : " + locale.pays + " prix : " + price[1]);

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

                                        }
                                        if (!!deal && (!deal.reductionGlobale || reduction < deal.reductionGlobale)) {
                                            deal.reductionGlobale = reduction;
                                        }


                                        deal.prixLocaux[locale.pays.replace('.', '')] = prix;

                                        console.log(numeroDeal + " - " + commun.articleUrlTemplate(locale.pays, asin) + " prix : " + prix + " prixLocal : " + prixDeal + " reduction : " + reduction + " reductionGlobale : " + deal.reductionGlobale);
                                        if (deal.reductionGlobale < 35) {
                                            //                        emailDealList.push(deal)
                                        }
                                        deal.save();
                                        console.log("End Deal found asin : " + asin + " locale : " + locale.pays + " prix : " + price[1]);

                                        deferred.resolve(parameters);

                                    }
                                });

                            //
                        }
                    }
                }
            );
        }
        else {
            deferred.resolve(parameters);

        }
// }
        return deferred.promise;


    }
    ;

recherchePrix(indexLien);

/*var intv = setInterval(function () {

 var dealToSend = emailDealList.pop();
 if (dealToSend !== undefined) {
 console.log("sending mail... deals left = " + emailDealList.length);
 sendMail(dealToSend);
 } else {
 console.log("nothing to send");
 }
 }, 60000);*/