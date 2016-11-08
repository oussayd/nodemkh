var dp = require('jasmine-data-provider'); //Install the npm package and provide its path
var lbcData = require('./data.js').data;
var EC = protractor.ExpectedConditions;
var IMAGES_PATH = "C:\\Users\\khaireddinem\\Google Drive\\leboncoin\\selenium\\";

//Authentification sur le site l b c
beforeAll(function () {
    browser.driver.manage().window().maximize();
    browser.ignoreSynchronization = true;
 /* NOUVELLE ADRESSE POUR LA CONNEXION
    https://compteperso.leboncoin.fr/account/index.html?ca=12_s
     */
    browser.get('https://compteperso.leboncoin.fr/account/index.html?ca=12_s').then(function () {
      /*  var connectBtn = element.all(by.css('[data-popin-template="connexion"]')).get(1);
        //  browser.sleep(2000);
        browser.wait(protractor.ExpectedConditions.visibilityOf(connectBtn));
        connectBtn.click();
*/
        //browser.sleep(2000);
        var usernameInput = element(by.css('[name="st_username"]'));
        browser.wait(protractor.ExpectedConditions.visibilityOf(usernameInput));

    element.all(by.id('connect_button')).click();
        browser.sleep(2000);

    });

});
beforeEach(function () {
    browser.driver.manage().window().maximize();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;

    return browser.ignoreSynchronization = true;

});
dp(lbcData, function (data) {
    it('should add ' + data.titre, function () {

        browser.get('https://www2.leboncoin.fr/ai?ca=12_s').then(function () {
            browser.sleep(Math.floor((Math.random() * 20000) + 10000));

            element(by.id(data.categorie)).click();
            element(by.id("subject")).sendKeys(data.titre);
            element(by.id("body")).sendKeys(data.desc);
            element(by.id("price")).sendKeys(data.prix);

          //  element.all(by.css('icon-close-circle-outline icon-2x'))[0].click();
            var cp = !!data.cp?data.cp:"94700";
            var ville = !!data.ville?data.ville:"Maisons-Alfort";
            element(by.id("location_p")).clear();

            element(by.id("location_p")).sendKeys(cp);
            browser.sleep(1000);
            element(by.css('[title="'+ville+'"]')).click();

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
                element(by.id("phone")).sendKeys(data.tel);
            }
            browser.sleep(Math.floor((Math.random() * 20000) + 10000));

            element(by.id("newadSubmit")).click();
            browser.sleep(1000);

            browser.wait(protractor.ExpectedConditions.visibilityOf(element(by.id("accept_rule"))),10000);
            browser.sleep(Math.floor((Math.random() * 20000) + 10000));

            element(by.id("accept_rule")).click();
            element(by.id("lbc_submit")).click();
            browser.sleep(Math.floor((Math.random() * 20000) + 10000));


            expect(browser.getTitle()).toContain("Confirmation");
            browser.sleep(2000);

        });

    });


});
