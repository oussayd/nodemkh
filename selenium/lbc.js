var dp = require('jasmine-data-provider'); //Install the npm package and provide its path
var lbcData = require('./data.js').data;
var env = require('./env.js').env;
var EC = protractor.ExpectedConditions;
var IMAGES_PATH = "D:\\GDrive\\leboncoin\\selenium\\";

//Authentification sur le site l b c
beforeAll(function () {
    browser.driver.manage().window().maximize();
    browser.ignoreSynchronization = true;
    /* NOUVELLE ADRESSE POUR LA CONNEXION
       https://compteperso.leboncoin.fr/account/index.html?ca=12_s
        */
    browser.get('https://compteperso.leboncoin.fr/account/index.html?ca=12_s').then(function () {

        var usernameInput = element(by.css('[name="st_username"]'));
        browser.wait(protractor.ExpectedConditions.visibilityOf(usernameInput));

        usernameInput.sendKeys(env.username);
        element.all(by.css('[name="st_passwd"]')).sendKeys(env.password);
        element.all(by.id('connect_button')).click();
        browser.sleep(2000);
        if (env.removeall) {
            element(by.id('allChecked_top')).click();
            browser.sleep(2000);

            element(by.css('a.remove')).click();
            browser.sleep(2000);
            
            browser.executeScript("window.scrollTo(0, document.body.scrollHeight);").then(function () {
                element(by.css('input[type="submit"]')).click();
            })
            browser.sleep(2000);

        }
    });

});
beforeEach(function () {
    browser.driver.manage().window().maximize();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;

    return browser.ignoreSynchronization = true;

});
dp(lbcData, function (data) {
    it('should add ' + data.titre, function () {

        browser.get('https://www.leboncoin.fr/ai?ca=12_s').then(function () {
            browser.sleep(Math.floor((Math.random() * 20000) + 10000));

            element(by.id(data.categorie)).click();
            element(by.id("subject")).sendKeys(data.titre);
            element(by.id("body")).sendKeys(data.desc);
            element(by.id("price")).sendKeys(data.prix);

            //  element.all(by.css('icon-close-circle-outline icon-2x'))[0].click();
            var cp = !!data.cp ? data.cp : "78180";
            var ville = !!data.ville ? data.ville : "Montigny-le-Bretonneux";
            element(by.id("location_p")).clear();

            element(by.id("location_p")).sendKeys(cp);
            browser.sleep(1000);
            element(by.css('[title="' + ville + '"]')).click();

            browser.sleep(3000);

            element(by.id("image0")).sendKeys(IMAGES_PATH + data.image0);
            browser.sleep(1000);

            if (!!data.image1) {
                element(by.id("image1")).sendKeys(IMAGES_PATH + data.image1);
                browser.sleep(1000);

            }
            if (!!data.image2) {
                element(by.id("image2")).sendKeys(IMAGES_PATH + data.image2);
                browser.sleep(1000);

            }
            if (!!data.tel) {
                element(by.id("phone")).clear();

                element(by.id("phone")).sendKeys(data.tel);
            }
            if (!!data.hidden && data.hidden) {

                element(by.id("phone_hidden")).click();
            }

            browser.sleep(Math.floor((Math.random() * 20000) + 10000));

            element(by.id("newadSubmit")).click();
            browser.sleep(1000);

            browser.wait(protractor.ExpectedConditions.visibilityOf(element(by.id("accept_rule"))), 10000);
            browser.sleep(Math.floor((Math.random() * 20000) + 10000));

            element(by.id("accept_rule")).click();
            element(by.id("lbc_submit")).click();
            browser.sleep(Math.floor((Math.random() * 20000) + 10000));


            expect(browser.getTitle()).toContain("Confirmation");
            browser.sleep(2000);

        });

    });


});