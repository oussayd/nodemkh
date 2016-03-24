var winston = require('winston');
var mongoose = require('mongoose'); // mongoose for mongodb
mongoose.connect('mongodb://localhost:27017/amazon'); // connect to mongoDB database on modulus.io

// define model =================
var Article = mongoose.model('Article', {
    titre: String,
    categorie: String,
    pays: String,
    url: String,
    prix: Number,
    indice: Number,
    img: String,
    lastUpdate: Date
});




var formatter = function (args) {
    var logMessage = args.message;
    return logMessage;
};

var getAvg = function (_collection) {
    var avg = _collection.reduce(function (p, c) {
        return p + c;
    }) / _collection.length

    return avg;
};
var ASIN = 'B00MGF1LI2';

var Money = function (amount, currency, culture, extraAmount) {
    this.amount = amount;
    this.extraAmount = extraAmount;
    this.currency = currency;
    this.culture = culture;
    console.log('Money', this);
};
Money.prototype.for = function (currency, culture) {
    var rate = Rates[currency] / Rates[this.currency];
    var convertedAmount = this.amount * rate;
    var convertedExtraAmount = this.extraAmount !== undefined ? this.extraAmount * rate : undefined;
    console.log('Conversion\n', this.currency, '->', currency,
        '\n', Rates[this.currency], '->', Rates[currency],
        '\n', this.amount, '->', convertedAmount);
    return new Money(convertedAmount, currency, culture, convertedExtraAmount);
};
Money.prototype.toString = function () {
    console.log(this.amount, this.culture, Globalize.format(this.amount, "c", this.culture));
    if (this.extraAmount === undefined)
        return Globalize.format(this.amount, "c", this.culture);
    else
        return Globalize.format(this.amount, "c", this.culture) + ' - ' + Globalize.format(this.extraAmount, "c", this.culture);
};

var Shop = function (id, title, domain, base_url, currency, culture) {
    this.id = id;
    this.title = title;
    this.domain = domain;
    this.base_url = base_url;
    this.url = this.base_url;
    this.currency = currency;
    this.culture = culture;
    this.setAsin = function (asin) {
        this.url = this.urlFor(asin);
    };
    this.urlFor = function (asin) {
        return this.base_url.replace('{asin}', asin);
    };
    this.moneyFrom = function (amount) {
        //console.log(amount);
        var culture = this.culture;
        if (amount.indexOf('-') == -1) {
            var sanitizedAmount = Globalize.parseFloat(amount.replace(/[^\d^,^.]/g, ''), culture);
            return new Money(sanitizedAmount, this.currency, culture);
        }
        var sanitizedAmounts = amount.split('-').map(function (a) {
            return Globalize.parseFloat(a.replace(/[^\d^,^.]/g, ''), culture);
        });
        //console.log(sanitizedAmounts);
        return new Money(sanitizedAmounts[0], this.currency, culture, sanitizedAmounts[1]);
    };
};
var shops = [
        new Shop(1, 'amazon.co.uk', 'www.amazon.co.uk', 'http://www.amazon.co.uk/dp/{asin}?', 'GBP', 'en-GB'),
        new Shop(2, 'amazon.de', 'www.amazon.de', 'http://www.amazon.de/dp/{asin}?', 'EUR', 'de'),
        new Shop(3, 'amazon.fr', 'www.amazon.fr', 'http://www.amazon.fr/dp/{asin}?', 'EUR', 'fr'),
        new Shop(5, 'amazon.it', 'www.amazon.it', 'http://www.amazon.it/dp/{asin}?', 'EUR', 'it'),
        new Shop(4, 'amazon.es', 'www.amazon.es', 'http://www.amazon.es/dp/{asin}?', 'EUR', 'es')
    ];


describe('Amazon traking warehouse', function () {

    beforeAll(function () {
        browser.ignoreSynchronization = true;

        browser.driver.manage().window().setSize(1280, 1440);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;

    });

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;
    });


    it('tacking ', function () {

        search(ASIN);

    });

});

/*$.each(shops, function (index, shop) {
    var $shopInfo = $('#snoop-shop-' + shop.id);
    pageScraper.getPriceOn(shop, function (price) {
        page.displayPrice($shopInfo, shop.moneyFrom(price));
    }, function (warning, addNotFoundClass) {
        page.displayWarning($shopInfo, warning, addNotFoundClass);
    });
});


var pageScraper = {
    warning: {
        networkError: 'Network error',
        unavailable: 'Unavailable',
        notFound: 'Not found',
        multipleOptions: 'Multiple options'
    },
    getPriceOn: function (shop, displayPrice, displayWarning) {
        var serverUrl = shop.url;
        $.get(serverUrl).success(function (data) {
            var regex = /[nb]\s*?id="priceblock_[\w]*?price".*?>(.*?)</img; //partea cu [nb] captureaza span sau b
            var price = regex.exec(data);
            if (price == null || price.length != 2) {
                displayWarning(pageScraper.warning.unavailable, false);
                return;
            }
            displayPrice(price[1]);
        }).error(function (data) {
            if (data.status == 404)
                displayWarning(pageScraper.warning.notFound, true);
            else
                displayWarning(pageScraper.warnings.networkError, false);
        });
    }
};*/

var search = function (asin) {

    shops.forEach(function (shop) {
        shop.setAsin(asin);
        browser.driver.get(shop.url);
        element(by.id('priceblock_ourprice')).getText().then(function (text) {
            console.log(text);
        });


    });

}