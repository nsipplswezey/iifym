module.exports = {
  'Macro buttons appear, and are clickable' : function(browser){
    browser
      .url('http://localhost:3000/')
      .waitForElementVisible('body',1000)
      .waitForElementVisible('button[data-test=fat-10]',1000)
      .click('button[data-test=fat-10]');

    browser.elements('css selector','button[data-test=fat-10]',function(result){
      console.log(result);


    });

    //TODO: remove all data-test properties from all elements for production
    //Use https://github.com/oliviertassinari/babel-plugin-react-remove-properties

      browser.end();

  }

};
