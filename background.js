'use strict';

var list = [];

// Linking Disinfo Busters website with icon in main Google Chrome toolbar
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({
    url: 'https://disinfobusters.weebly.com/stop.html'
  })
})

// in progrss below this comment

// load csv file
// detect opening of website on the list

function processCSV(allText, hasHeaders = false) {
  if (hasHeaders !== true){
      var allTextLines = allText.split(/\r\n|\n/);
      var headers = allTextLines[0].split(',');
      var lines = [];
    
      for (var i = 0; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
    
          var tarr = [];
          for (var j = 0; j < headers.length; j++) {
            tarr.push( data[j] );
          }
          lines.push(tarr);
        }
      }
  } else {
      var allTextLines = allText.split(/\r\n|\n/);
      var headers = allTextLines[0].split(',');
      var lines = [];
    
      for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
    
          var tarr = [];
          for (var j = 0; j < headers.length; j++) {
            tarr.push( data[j] );
          }
          lines.push(tarr);
        }
      }
  }
  return lines;
}

function getBlacklist(allText) {
  var data = processCSV(allText);
  return data
  .map( function(item) {
      return item[0].split(' ');
    }
  )
  .filter( function(item) {
      return Number(item[1]) > 0.9
  })
  .map( function(item) {  
      return ("*://" + item[0] + "/*");
  })
}

var csv_source = "https://raw.githubusercontent.com/qcri/COVID19-MAL-Blacklist/master/disinfo/disinfo_latest.csv"

var xhr = new XMLHttpRequest();
xhr.open("GET", csv_source, true);
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    list = getBlacklist(xhr.responseText);
    console.log("retrieved blacklist from" + csv_source, list)
  }
}
xhr.send();

console.log( 'list',list)
if (Array.isArray(list) && list.length) {console.log("list is empty", list)}
else {
  console.log("list retrieved! Establishing redirect.");
  chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
      console.log("Disinfo site intercepted: " + details.url);
      return {
        redirectUrl: chrome.extension.getURL("warning.html")
        //"https://www.disinfobusters.eu/stop"
      };
    },
    // filters
    {
      urls: list
    },
    // extraInfoSpec
    ["blocking"]);
};



// chrome.runtime.onInstalled.addListener(function() {
//     // todo: get csv file https://github.com/qcri/COVID19-MAL-Blacklist/blob/master/blacklist/covid19mal_latest.csv

//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", "https://github.com/qcri/COVID19-MAL-Blacklist/blob/master/blacklist/covid19mal_latest.csv", true);
//     xhr.onreadystatechange = function() {
//       if (xhr.readyState == 4) {
//         // JSON.parse does not evaluate the attacker's scripts.
//         var resp = JSON.parse(xhr.responseText);
//       }
//     }
//     xhr.send();

//     chrome.storage.sync.set({color: '#3aa757'}, function() {
//       console.log("The color is green.");
//     });


// // change url
//     chrome.tabs.query({'active': true}, function(tabs) {
//       chrome.tabs.update(tabs[0].id, {url: 'https://www.disinfobusters.eu/stop'});
//     });




//     chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//         chrome.declarativeContent.onPageChanged.addRules([{
//           conditions: [new chrome.declarativeContent.PageStateMatcher({
//             pageUrl: {hostEquals: 'developer.chrome.com'},
//           })
//           ],
//               actions: [new chrome.declarativeContent.ShowPageAction()]
//         }]);
//       });
//   });