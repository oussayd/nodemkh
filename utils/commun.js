var http = require('http');
var request = require('request');
var parser = require("number-parsing");
var fs = require("fs");
var format = require("string-template");
var compile = require("string-template/compile");
var cheerio = require('cheerio');

var locale = [
    {
        pays: 'fr',
        taux: 1
    },
    {
        pays: 'de',
        taux: 1
    },
    {
        pays: 'it',
        taux: 1
    },
    {
        pays: 'co.uk',
        taux: 1.2
    }
];

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

var parsePrice = function (stringPrice, pays) {
    prix = -1;
    if (pays === 'co.uk') {
        prix = parser(stringPrice.replace(/[^\d^,^.]/g, ''), {
                us: 0.75,
                fr: 0.25
            }) * 1.2;
    } else {
        prix = parser(stringPrice.replace(/[^\d^,^.]/g, ''));

    }


    return prix.toFixed(2);
};

var blackList = [
    "Lesley", "Régnier", "Lip Style", "Black Dice", "Timex", "All Blacks", "Victorinox", "SO&CO", "Candino", "Sector", "BUREI", "Jacques Lemans", "Invicta",
    "Stuhrling", "Time100", "Danish Design", "Issey", "Akribos", "Eton Unisex", "Juicy Couture", "Bering Time", "Windrose watch", "AVI-8 Watch",
    "Thomas Earnshaw", "August Steiner", "Carvelle New York", "Nixon", "Burgmeister", "Joshua & Sons", "Cannibal", "Woodford Swiss-Made", "Old England",
    "Thomas Earnshaw", "Mike Ellis", "Karen Millen", "LTD Watch", "Ingersoll", "Rosendahl", "Heisse & Söhne", "Certina Quartz", "Performer", "Ben Sherman",
    "Signature Montana", "Nooka", "Comtex", "Constantin Durmont", "Detomaso Herrenuhr", "Nautec No", "Detomaso IT", "Ma'dor", "University Sports",
    "So & Co", "Suunto Core", "Orologio Da Polso", "Regent ", "Suunto", "Projects Watches", "Spinnaker Tornado", "APUS ", "Marc Jacobs", "CIIZEN", "ves Camani",
    "Calypso watches", "Detomaso Airbreaker", "Kahuna", "CHIYODA", "Diadora Storm", "Faber-Castell", "Daniel Wellington", "Watch Winder", "Anne Klein",
    "Feibrand Scatola", "Kezzi", "XLORDX", "Safco Reveal", "Beco Uhrenbox", "Momentum", "Morellato", "Technomarine", "ODM Unisex", "Haurex Italy", "Technomarine",
    "Orphelia", "Lancaster", "Just Watches", "Freestyle Herren", "Morellato Lederarmband", "ORIGINAL CALYPSO", "Eichmüller Unisex", "Morgan De Toi", "Men'Limit",
    "Philip Watch", "Kenneth Cole", "MADISON NEW YORK", "Daniel Hechter", "Autran & Viala", "Zadig & Voltaire", "Shaon Herren", "RELOJ MARK MADDOX", "Michel Herbelin",
    "Elysee Herren", "Slazenger", "TID Watches", "Lindberg", "Morellato", "M&M", "B360", "QUANTUM", "WEGNER", "ALPHA SAPHIR", "Chris Benz", "Perigaum", "CEPHEUS",
    "GANT Damen", "TOC03", "Excellanc", "GOBU", "Prince London", "Calypso", "Autran & Viala", "Apricassa", "JSDDE", "Joannis Meursii", "Tikkers", "fiimi",
    "Spider Man", "G10 NATO MOD", "REFLEX BOYS", "AWStech", "LEORX LED", "Ravel", "Georgie", "Mudder", "FORTIS", "ZeitPunkt", "Reflex Kinder", "AMPM24",
    "Feld Rennen", "Tinksky", "Moshi Monsters", "iStrap", "Tikkers", "Genießen", "BABAN", "SPIDERMAN", "Predator", "Berger & Schröter", "JCC", "Tikkers", "Surwin",
    "Montre Watch Color", "SKMEI","Casio", "Riccardo", "Panegy", "Zeiger", "NRS Healthcare", "maxhood", "KS Bracelet", "Sekonda", "Kronen&Söhne", "Shaghafi", "Souarts Damen"
];
var whiteList = [
    "Boss", "Calvin Klein",  "Cerruti", "Citizen", "Diesel", "DKNY", "Emporio", "Armani", "Festina", "Fossil", "Guess", "Hamilton", "Ice-Watch", "Paul Gaultier",
    "Lacoste", "Lotus", "Maserati", "Burton", "Police", "Pulsar", "Sector", "Seiko", "Swatch", "Ted Lapidus", "Tissot"
];
var articleUrlTemplate = compile("http://www.amazon.{0}/dp/{1}");
var baseUrlTemplate = compile('http://www.amazon.{0}/gp/offer-listing/');
exports.whiteList = whiteList;
exports.blackList = blackList;
exports.getUrlInfos = getUrlInfos;
exports.extractDomain = extractDomain;
exports.locale = locale;
exports.parsePrice = parsePrice;
exports.articleUrlTemplate = articleUrlTemplate;
exports.baseUrlTemplate = baseUrlTemplate;