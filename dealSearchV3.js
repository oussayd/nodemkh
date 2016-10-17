/**
 * Created by khaireddinem on 09/10/2016.
 */

var http = require('http');
var Q = require('q');
var request = require('request');
var rp = require('request-promise');
var parser = require("number-parsing");
var fs = require("fs");
var format = require("string-template");
var compile = require("string-template/compile");
var cheerio = require('cheerio');
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


var commun = require('./utils/commun.js');


var lienInfo = {
    CATEGORIE: 'MONTRES',
    LINK: "https://www.amazon.fr/s/ref=sr_pg_{0}?fst=as%3Aoff&rh=n%3A3581943031%2Cn%3A60649031%2Cp_89%3AHugo+Boss%7CSamsung%7CFossil%7CPolice%7CSeiko%7CLotus&page={0}&bbn=3581943031&ie=UTF8&qid=1476728791"
}


var TIMEOUT = 3000;
var prixLimite = 75;
var compareLocalPrices = false;
var numeroDeal = 0;
var dealList;
var pageIndex;
var urlInfo;
var baseUrl;
var $;
var recherchePrix = function () {


    urlInfo = commun.getUrlInfos(compile(lienInfo.LINK)(1));
    baseUrl = commun.baseUrlTemplate(urlInfo.locale);

    console.log(urlInfo);
    pageIndex = 1;


    searchLoop();


};


var searchLoop = function () {

    console.log("+++++++++++++++++++++++ Page " + pageIndex + " +++++++++++++++++++++++");
    var url = compile(lienInfo.LINK)(pageIndex);
    console.log("[" + lienInfo.CATEGORIE + "] Page URL : " + url);
    scrapPricesFromPage(url)
        .then(checkNext);

};

var promiseFn1 = function (index) {
    var deferred = Q.defer();

    setTimeout(function () {
        console.log("Etatpe 1 : " + index);
        deferred.resolve(index);
    }, 1000);
    return deferred.promise;
};

var checkNext = function () {


    pageIndex++;
    if (!lastPage && pageIndex < 401) {
        return searchLoop();
    } else {
       // var deferred = Q.defer();

        console.log("!!!!!!!!!!!!!!!!!!!!!!! LastPage " + pageIndex + " !!!!!!!!!!!!!!!!!!!!!!");
        logEnd();
        process.exit(0);

        //  exit(0);
        //deferred.resolve();
        //return deferred.promise;


    }

};


var parsePrice = function (prixString, urlInfo) {
    var prix;
    if (prixString) {
        prix = commun.parsePrice(prixString, {
            pays: urlInfo.locale,
            taux: 1.3
        });
    }
    return prix;
}
var scrapPricesFromPage = function (_url, urlInfo, baseUrl) {

    var deferred = Q.defer();

    var options = reqOptions(_url);

    rp(options)
        .then(function (body) {
            $ = cheerio.load(body);

            lastPage = ($("#noResultsTitle").html() != undefined && $("#noResultsTitle").html().length > 0) || ($("div.proceedWarning").html() != undefined && $("div.proceedWarning").html().length > 0);
            dealList = $("li[id^='result']");
            if (!lastPage) {
                promiseAll(0).then(function () {
                    deferred.resolve();
                });
            } else {
                deferred.resolve();
            }
        })
        .catch(function (err) {
            console.log(err);
            deferred.resolve();

        });


    return deferred.promise;

}

var promiseFn4 = function (dealListIndex) {

    //setTimeout(function () {
    //  console.log("Etatpe 4 : " + index);
    dealListIndex++;
    if (dealListIndex < dealList.length)
        return promiseAll(dealListIndex);
    //  }, 1000);

};
var promiseAll = function (index) {
    return promiseFn1(index)
    //     .then(promiseInt)
        .then(promiseFn4);

};

var promiseFn1 = function (index) {
    var deferred = Q.defer();
    console.log("Etatpe 1 : " + index);

    numeroDeal++;
    _this = dealList[index];
    asin = $(_this).attr('data-asin');
    titre = $(_this).find($('h2')).text();
    imgUrl = $(_this).find($('img')).attr('src');
    prix = -1;
    prixString = $(_this).find($('.a-color-price')).text();
    prix = parsePrice(prixString, urlInfo);

    console.log(numeroDeal + " - " + asin + " : " + prix);
    setTimeout(function () {
        deferred.resolve(index);
    }, 200);


    return deferred.promise;
};

function logEnd() {
    console.log("//+++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("////////////////////// ////// THE END ////////////////////////////");
    console.log("//+++++++++++++++++++++++++++++++++++++++++++++++++++++++");
}

var reqOptions = function (_url) {
    return {
        url: _url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36'
            //    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
            // 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0'
        }
    }
};


recherchePrix();