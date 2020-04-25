'use strict';

// Linking Disinfo Busters website with icon in main Google Chrome toolbar
chrome.browserAction.onClicked.addListener( function(tab) {
    chrome.tabs.create({url: 'https://www.disinfobusters.eu/stop '})
})


// in progrss below this comment

// load csv file
// detect opening of website on the list



chrome.runtime.onInstalled.addListener(function() {
    // todo: get csv file
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("The color is green.");
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'developer.chrome.com'},
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
      });
  });
  