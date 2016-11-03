var dp = require('jasmine-data-provider'); //Install the npm package and provide its path
var lbcData = require('./data.js').data;
var EC = protractor.ExpectedConditions;
var IMAGES_PATH = "C:\\Users\\khaireddinem\\Google Drive\\leboncoin\\selenium\\";

//Authentification sur le site l b c
beforeAll(function () {
    browser.driver.manage().window().maximize();
    browser.ignoreSynchronization = true;
    browser.get('https://www.leboncoin.fr/li?ca=12_s').then(function () {
        var connectBtn = element.all(by.css('[data-popin-template="connexion"]')).get(1);
        //  browser.sleep(2000);
        browser.wait(protractor.ExpectedConditions.visibilityOf(connectBtn));
        connectBtn.click();

        //browser.sleep(2000);
        var usernameInput = element(by.css('[name="st_username"]'));
        browser.wait(protractor.ExpectedConditions.visibilityOf(usernameInput));

        usernameInput.sendKeys("oussayd@gmail.com");
        element.all(by.css('[name="st_passwd"]')).sendKeys("rafhaj14");
        element.all(by.css('[value="Se connecter"]')).click();
        browser.sleep(2000);

    });

});
beforeEach(function () {
    browser.driver.manage().window().maximize();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

    return browser.ignoreSynchronization = true;

});
dp(lbcData, function (data) {
    it('should add ' + data.titre, function () {

        browser.get('https://www2.leboncoin.fr/ai?ca=12_s').then(function () {
            element(by.id(data.categorie)).click();
            element(by.id("subject")).sendKeys(data.titre);
            element(by.id("body")).sendKeys(data.desc);
            element(by.id("price")).sendKeys(data.prix);
            element(by.id("location_p")).sendKeys("94700");
            browser.sleep(200);
            element(by.css('[title="Maisons-Alfort"]')).click();
            element(by.id("image0")).sendKeys(IMAGES_PATH + data.image0);
            if (!!data.image1) {
                element(by.id("image1")).sendKeys(IMAGES_PATH + data.image1);
            }
            if (!!data.image2) {
                element(by.id("image2")).sendKeys(IMAGES_PATH + data.image2);
            }
            browser.sleep(1000);
            element(by.id("newadSubmit")).click();
            //browser.sleep(1000);
            browser.wait(protractor.ExpectedConditions.visibilityOf(element(by.id("accept_rule"))));

            element(by.id("accept_rule")).click();
            element(by.id("lbc_submit")).click();
            browser.sleep(2000);

            expect(browser.getTitle()).toContain("Confirmation");
            browser.sleep(2000);

        });

    });


});
