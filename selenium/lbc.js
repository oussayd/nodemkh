var dp = require('jasmine-data-provider'); //Install the npm package and provide its path
var lbcData = require('./data.js').data;

console.log(lbcData);
beforeAll(function () {
    browser.driver.manage().window().maximize();
    browser.ignoreSynchronization = true;
    browser.get('https://www.leboncoin.fr/li?ca=12_s').then(function () {
        var connectBtn = element.all(by.css('[data-popin-template="connexion"]')).get(1);
        browser.sleep(2000);
        connectBtn.click();
        browser.sleep(2000);
        var usernameInput = element.all(by.css('[name="st_username"]'));
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
    it('should add a todo', function () {

        browser.get('https://www2.leboncoin.fr/ai?ca=12_s').then(function () {
            element(by.id("subject")).sendKeys(data.titre);
            element(by.id("body")).sendKeys(data.desc);
            element(by.id("price")).sendKeys(data.prix);
            element(by.id("location_p")).sendKeys("94700");
            browser.sleep(200);
            element.all(by.css('[title="Maisons-Alfort"]')).click();
            element(by.id("cat6")).click();
            element(by.id("image0")).sendKeys("C:\\Users\\khaireddinem\\Google Drive\\leboncoin\\Velo\\antivol-u-auvray-titan-320-avec-support.jpg");
            browser.sleep(1000);
            element(by.id("newadSubmit")).click();
            browser.sleep(1000);
            element(by.id("accept_rule")).click();
        });
        browser.sleep(3500);

    });


});
