/**
 * Created by khaireddinem on 07/09/2016.
 */
var Q = require('q');

var dealsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
i = 0;
var promiseFn1 = function (index) {
    var deferred = Q.defer();

    setTimeout(function () {
        console.log("Etatpe 1 : " + index);
        deferred.resolve(index);
    }, 1000);
    return deferred.promise;
};

var promiseFn2 = function (index) {
    var deferred = Q.defer();

    setTimeout(function () {
        console.log("Etatpe 2 : " + index);
        deferred.resolve(index);
    }, 1000);
    return deferred.promise;
};
var promiseFn3 = function (index) {
    var deferred = Q.defer();

    setTimeout(function () {
        console.log("Etatpe 3 : " + index);
        deferred.resolve(index);
    }, 1000);
    return deferred.promise;
};
var promiseFn4 = function (index) {

    setTimeout(function () {
        console.log("Etatpe 4 : " + index);
        index++;
        if (index < dealsList.length)
            return promiseAll(index);
    }, 1000);

};

var promiseInt = function (index) {
    return promiseFn2(index).then(promiseFn3);
}
var promiseAll = function (index) {
    promiseFn1(index)
        .then(promiseInt)


    .
    then(promiseFn4);

};
promiseAll(0);

//promiseQ(10).then(promiseQ).then(promiseQ);
/*
 var getLocalPrices = function (parameters) {
 var asin = parameters.asin;
 var localeList = parameters.localeList;
 var localeIndex = parameters.localeIndex;
 var urlInfo = parameters.urlInfo;
 var prixDeal = parameters.prixDeal;
 var numeroDeal = parameters.numeroDeal;

 console.log(localeIndex  + " - " + asin+ " - " +  localeList+ " - " +   urlInfo+ " - " +  prixDeal+ " - " +  numeroDeal);
 parameters.localeIndex++;
 var deferred = Q.defer();
 setTimeout(function(){

 deferred.resolve(parameters);
 },1000);

 return deferred.promise;
 };

 getLocalPrices({
 asin: "asin",
 localeList: "locale",
 localeIndex: 0,
 urlInfo: "urlInfo",
 prixDeal: "prix",
 numeroDeal: "numeroDeal"
 })
 .then(getLocalPrices)
 .then(getLocalPrices)
 .then(getLocalPrices).then(function(){console.log("the end")});
 */


