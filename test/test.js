var Browser = require("zombie");
var assert = require("assert");
var config = require("../config");

// Load the page from localhost
browser = new Browser();

describe('Browser getting pages', function(){
  
  describe('/coffee/online/*', function(){   
    it('should return "Online - kaffe" as h1', function(){
      browser.visit("http://localhost:"+config.server.port+"/coffee/Online", function(e, browser) {
        assert.ok(browser.success);
        if(browser.error)
          console.log("Errors not reported:", browser.errors);
        
        assert.equal(browser.text("H1"), "Online - kaffe");
      });
    });
    
    it('should get valig status code for getting all pots', function(){
      browser.visit("http://localhost:"+config.server.port+"/coffee/Online/all", function(e, browser) {
        assert.ok(browser.success);
        if(browser.error)
          console.log("Errors not reported:", browser.errors);
        
      });
    });
  });
});

