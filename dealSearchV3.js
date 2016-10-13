/**
 * Created by khaireddinem on 09/10/2016.
 */

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

var TIMEOUT = 3000;
var prixLimite = 75;
var compareLocalPrices = false;