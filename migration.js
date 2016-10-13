var http = require('http');
var request = require('request');
var parser = require("number-parsing");
var fs = require("fs");
var format = require("string-template");
var compile = require("string-template/compile");
var cheerio = require('cheerio');
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


const stream = Deal.find({}).stream();

// Print every document that matches the query, one at a time
stream.on('data', deal = > {


    stream.pause();

NewDeal.findOne({
        "asin": asin,
    },
    function (err, deal) {
        if (err) {
            console.log(err);
        } else if (deal != null) {


        } else {

            concertToNewDeal()
            var newDeal = new NewDeal({
                "asin": asin
            });


        }
    });

console.log(doc.titre);
setTimeout(function () {
    stream.resume();
}, 50);


})
;