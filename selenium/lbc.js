beforeEach(function() {
    browser.driver.manage().window().maximize();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

    return browser.ignoreSynchronization = true;

});

describe('angularjs homepage todo list', function() {
    it('should add a todo', function() {
        browser.get('https://www.leboncoin.fr/li?ca=12_s').then(function(){
            //var xpathB = element(by.xpath('.//*[@id="header"]/section/section/aside/button'));
            var cssC = element.all(by.css('[data-popin-template="connexion"]')).get(1);
         //   var cssClass = element(by.css('popin-open'));
          //  console.log(xpathB.getTagName());
            //console.log(cssC.getTagName());
            browser.sleep(2000);

            cssC.click();
            browser.sleep(1000);

           element.all(by.css('[name="st_username"]')).sendKeys("oussayd@gmail.com");
            element.all(by.css('[name="st_passwd"]')).sendKeys("rafhaj14");
            element.all(by.css('[value="Se connecter"]')).click();

            browser.get('https://www2.leboncoin.fr/ai?ca=12_s').then(function(){
                element(by.id("body")).sendKeys("test qdsf q qdsf lmq dfmqsdf kj qhqsmdkf hqsdf\\n qsdmfkj");
                element(by.id("subject")).sendKeys("test qdsf q");
                element(by.id("price")).sendKeys("15");
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



            //  console.log(cssClass.getTagName());
            browser.sleep(35000);

        });



//        element(by.model('todoList.todoText')).sendKeys('write first protractor test');
       // element(by.css('[data-popin-template="connexion"]')).click();

  /*      var todoList = element.all(by.repeater('todo in todoList.todos'));
        expect(todoList.count()).toEqual(3);
        expect(todoList.get(2).getText()).toEqual('write first protractor test');

        // You wrote your first test, cross it off the list
        todoList.get(2).element(by.css('input')).click();
        var completedAmount = element.all(by.css('.done-true'));
        expect(completedAmount.count()).toEqual(2);*/
    });
});