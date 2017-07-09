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
var RECONDITIONNE = require('./utils/reconditionne.js');
var NOUVEAU = require('./utils/nouveau.js');
var USER_AGENTS = require('./utils/userAgents.js');

const winston = require('winston');

winston.loggers.add('dev', {
  console: {
    level: 'silly',
    timestamp:true,
    colorize: 'true'  }
});

const logger = winston.loggers.get('dev');


// mongoose for mongodb
mongoose.connect('mongodb://localhost:27017/amazon'); // connect to mongoDB database on modulus.io

var skipList = false;
var lienInfo = {
    CATEGORIE: 'MONTRES',
    LINK: "https://www.amazon.fr/s/ref=sr_pg_{0}?fst=as%3Aoff&rh=n%3A3581943031%2Cn%3A60649031%2Cp_89%3AHugo+Boss%7CSamsung%7CFossil%7CPolice%7CSeiko%7CLotus&page={0}&bbn=3581943031&ie=UTF8&qid=1476728791"
}

//var searchList  = RECONDITIONNE.BARRES_TOIT;
/* var searchList  = RECONDITIONNE["FR"];
*/ 
//var searchList  = RECONDITIONNE["PC"];
var args = process.argv.slice(2);

 var searchList  = RECONDITIONNE[args];
 
/*var searchList  = RECONDITIONNE["PC"];
*/
//var searchList  = RECONDITIONNE.TOP;
//var searchList = RECONDITIONNE.DE;
//var searchList = NOUVEAU.BARRES_TOIT;
var indexLien = 0;
var links = [];
for (var key in searchList) {
    if (searchList.hasOwnProperty(key)) {
        links.push(searchList[key]);
    }
}


var isNew = true;
var UPDATE_DB = false;
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
    reductionEstim: Number,
    img: String,
    lastUpdate: Date,
    version: Number
});


var commun = require('./utils/commun.js');


//var START_INDEX =39;
var START_INDEX =0;
var TIMEOUT = 1000;
var prixLimite = 75;
var compareLocalPrices = false;
var numeroDeal = 0;
var dealList;
var pageIndex;
var urlInfo;
var baseUrl;
var $;


var lastPricesEstim =[];

var getReductionEstim = function(nouveauPrix){
    var moyenne = moyennePrixEstim();
    var reducEstim =100;
    if (moyenne>0) {
     reducEstim =  nouveauPrix*100/moyenne ;
    }
    updateListPricesEstim(nouveauPrix);
    logger.info("moyenne : " +moyenne + " lastPricesEstim : " + lastPricesEstim );
    return reducEstim.toFixed(2);
}

var updateListPricesEstim = function(nouveauPrix){
    if (lastPricesEstim.length>=7){
        lastPricesEstim.splice(0,1);
    }
    lastPricesEstim.push(nouveauPrix);
}

var moyennePrixEstim = function() {
    var moyenne =0;
    var sum = 0;
    if (lastPricesEstim.length>0){
        for (var i = 0; i < lastPricesEstim.length; i++) {
            sum += lastPricesEstim[i];
        }
        moyenne= sum/lastPricesEstim.length;
    }
    return moyenne;
}


var recherchePrix = function (indexL) {

    lastPricesEstim =[];
    lienInfo = links[indexL];

    urlInfo = commun.getUrlInfos(compile(lienInfo.LINK)(1));
    baseUrl = commun.baseUrlTemplate(urlInfo.locale);

    pageIndex = 1;


    searchLoop();


};


var searchLoop = function () {

    logger.info("+++++++++++++++++++++++ Page " + pageIndex + " +++++++++++++++++++++++");
    var url = compile(lienInfo.LINK)(pageIndex)+"&sort=price-desc-rank";
    logger.info("[" + lienInfo.CATEGORIE + "] Page URL : " + url);
    scrapPricesFromPage(url)
        .then(checkNext);

};

var promiseFn1 = function (index) {
    var deferred = Q.defer();

    setTimeout(function () {
        logger.info("Etatpe 1 : " + index);
        deferred.resolve(index);
    }, TIMEOUT);
    return deferred.promise;
};

var checkNext = function () {


    pageIndex++;
    if (!lastPage && pageIndex < 401) {
        setTimeout(function() {
            return searchLoop();
        },TIMEOUT);
    } else {
          indexLien++;

        if (indexLien < links.length) {

            lastPage = false;
            logger.info("//////////////////////////// Passage à la categorie " + links[indexLien].CATEGORIE + " ////////////////////////////");

            recherchePrix(indexLien);
        }else {
       // var deferred = Q.defer();

        logger.info("!!!!!!!!!!!!!!!!!!!!!!! LastPage " + pageIndex + " !!!!!!!!!!!!!!!!!!!!!!");
        logEnd();
        process.exit(0);
        }
        //  exit(0);
        //deferred.resolve();
        //return deferred.promise;


    }

};


var parsePrice = function (prixString,pays ) {
    var prix;
    if (prixString) {
        prix = commun.parsePrice(prixString, pays);
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
            logger.error(err);
            deferred.resolve();

        });


    return deferred.promise;

}

var promiseFn4 = function (dealListIndex) {

    //  logger.info("Etatpe 4 : " + index);
    dealListIndex++;
    if (dealListIndex < dealList.length)
        return promiseAll(dealListIndex);


};
var promiseAll = function (index) {
    return promiseFn1(index)
    //     .then(promiseInt)
        .then(promiseFn4);

};

function createNewDeal(asin, titre, prix, imgUrl, deferred, index) {
    logger.info("deal not found");

    var newDeal = new Deal({
        asin: asin,
        pays: urlInfo.locale,
        titre: titre,
        categorie: lienInfo.CATEGORIE,
        url: baseUrl + asin + '/',
        prix: prix,
        img: imgUrl,
        lastUpdate: Date.now(),
        version: 1

    });
    newDeal.save(function (err) {
        if (err) {
            logger.error(err);
        }
        updateAllLocales(newDeal, deferred, index);

       // deferred.resolve(index);
    })
}

function updateAllLocales(deal, deferred, index) {
    if (!!deal.asin) {
         deal.reductionEstim =  getReductionEstim(deal.prix);
    }
    updateLocalPrice(deal, "fr")
        .then(function () {
            updateLocalPrice(deal, "de")
                .then(function () {
                    updateLocalPrice(deal, "it")
                        .then(function () {
                            updateLocalPrice(deal, "co.uk")
                                .then(function () {
                                    if (!!deal.asin) {

                                        deal.save();
                                        logger.info(numeroDeal + " - " + deal.asin + " saved");
                                    }
                                        deferred.resolve(index);


                                })
                        })
                })
        })
    ;
}
function updateExistingDeal(deal, titre, asin, prix, imgUrl, deferred, index) {
    deal.titre = titre;
    deal.asin = asin;
    deal.categorie = lienInfo.CATEGORIE;
    deal.pays = urlInfo.locale;
    deal.url = baseUrl + asin + '/';
    deal.prix = prix;
    deal.img = imgUrl;
    deal.lastUpdate = Date.now();
    deal.version++;

    for (var key in deal.prixLocaux) {
        if (deal.prixLocaux.hasOwnProperty(key)&&deal.prixLocaux[key]<0) {
            deal.prixLocaux[key] = null;
            deal.reductionGlobale = null;
            deal.reduction = null;
        }
    }

    updateAllLocales(deal, deferred, index);



}
function updateDeal(index, deferred) {
    var _this = dealList[index];

    var asin = $(_this).attr('data-asin');
    var titre = $(_this).find($('h2')).text();
    var imgUrl = $(_this).find($('img')).attr('src');
    var prix = -1;

    var prixString = $(_this).find($('.a-size-small')).find($('.a-color-price')).text();
    if (!prixString){
        prixString = $(_this).find($('.a-color-price')).text();
    }
    prix = parsePrice(prixString, urlInfo.locale);

    logger.info(numeroDeal + " - " + asin + " : " + prix);

    if(!isNotInList(titre,lienInfo.CATEGORIE,commun.whiteList)){
    Deal.findOne({
        asin: asin,
        pays: urlInfo.locale
    }, function (err, deal){

        if (err){

            logger.error(err.type + " ---- " + err.value);
                deferred.resolve(index);
        }
        else if (!deal) {
            isNew = true;
            createNewDeal(asin, titre, prix, imgUrl, deferred, index);
        }else {
            isNew = false;
            updateExistingDeal(deal, titre, asin, prix, imgUrl, deferred, index);

        }
    });
    }else {
        deferred.resolve(index);
    }
/*    Deal.update({
            asin: asin,
            pays: urlInfo.locale
        },
        {
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
        },
        {
            upsert: true
        },
        function (err, deal) {
            if (err)
                logger.info(err);

            logger.info("-----" + JSON.stringify(deal));
            setTimeout(function () {
                deferred.resolve(index);
            }, 200);

        });*/
}
var isNotInList = function (title, categorie,listTitres) {

    logger.info( " - " + title )
    if (skipList || categorie.indexOf("MONTRES")<0) {
        return false;
    }
    if (!title) {
        return false;
    }
    for (var i = 0; i < listTitres.length; i++) {
        if (title.toLowerCase().indexOf(listTitres[i].toLowerCase()) >= 0) {
            return false
        }
    }
    return true;
}
var promiseFn1 = function (index) {
    var deferred = Q.defer();
    logger.info("Etatpe 1 : " + index);

    numeroDeal++;
    updateDeal(index, deferred);



    return deferred.promise;
};

function logEnd() {
    logger.info("//+++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    logger.info("////////////////////// ////// THE END ////////////////////////////");
    logger.info("//+++++++++++++++++++++++++++++++++++++++++++++++++++++++");
}

var getRandomUserAgent = function(){
    var uagent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    logger.info(uagent);
    return uagent;
};

var uA = getRandomUserAgent();
var nbReqs = 0;
var reqOptions = function (_url) {
    nbReqs++;
  //  if (nbReqs%25==0){
     uA = getRandomUserAgent();
   // logger.info(uA);
    //}
    return {
        url: _url
        ,
        headers: {
            'User-Agent':uA
			//'Host':'www.amazon.fr'
			//'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			//'Accept-Encoding':'gzip, deflate, sdch, br',
			//'Accept-Language':'fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4,ar;q=0.2',
			//'Cache-Control':'max-age=0',
			//'Connection':'keep-alive'
              // 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36'
              //  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
            //'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0'
        }
    }
};



function updateReduction(deal, prixLocal, pays, _urlLocale, deferred,delay) {
    var reduction = (100 * deal.prix / prixLocal).toFixed(2);
    if (!!deal && (!deal.reductionGlobale || reduction < deal.reductionGlobale)) {
        deal.reductionGlobale = reduction;
    }
    if (pays === deal.pays) {
        deal.reduction = reduction;
    }
    logger.info(numeroDeal + " - " + _urlLocale + " p[" + deal.prix + "]" + " pL[" + prixLocal + "]" + " r[" + deal.reduction + "]"  + " RE[" + deal.reductionEstim + "]" + " RG[" + deal.reductionGlobale + "]");
   if(delay){
    setTimeout(function () {
        deferred.resolve();
    }, TIMEOUT);
   }else {
       deferred.resolve();

   }
}

var checkPrice = function(price){
   return  (!!price && price >0);
}

var checkAnyPrice = function(prixLocaux){
    return  checkPrice(prixLocaux["fr"]) || checkPrice(prixLocaux["de"]) || checkPrice(prixLocaux["it"]) ||checkPrice(prixLocaux["couk"]);
}
var updateLocalPrice = function (deal,pays) {

    var deferred = Q.defer();
    var _urlLocale = commun.articleUrlTemplate( pays,deal.asin);

   /* setTimeout(function () {
        logger.info("updateLocalPrice : "  + deal.asin +" - "+ pays);
        deferred2.resolve();
    }, 2000);*/
    if (checkPrice(deal.prixLocaux[pays.replace('.', '')])){
        var prixLocal = deal.prixLocaux[pays.replace('.', '')].toFixed(2);
        updateReduction(deal, prixLocal, pays, _urlLocale, deferred,false);

    }else if (!isNew && checkAnyPrice(deal.prixLocaux)){
        deferred.resolve();
    }else
    {
        if (!UPDATE_DB){
            deferred.resolve();

        }else {
            var options = reqOptions(_urlLocale);

            rp(options)
                .then(function (body) {
                    var regex = /[nb]\s*?id="priceblock_[\w]*?price".*?>(.*?)</img;
                    var price = regex.exec(body);
                   // var $$$ = cheerio.load(body);

                    if (price == null || price.length != 2) {
                        deferred.resolve();
                    }else {
                        var prixLocal = commun.parsePrice(price[1], pays);
                        deal.prixLocaux[pays.replace('.', '')] =prixLocal;

            /*                var stock = $$$("#availability span").html();
                        if (stock != undefined && stock.trim().match(/\d+/) > 0) {
                            deal.stock[pays] = stock.trim().match(/\d+/)[0];
                        }*/
                        updateReduction(deal, prixLocal, pays, _urlLocale, deferred,false);
                    }
                })
                .catch(function (err) {
                    logger.error("err");
                    deferred.resolve();

                });
        }
    }

    return deferred.promise;

}

recherchePrix(indexLien);