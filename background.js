'use strict';

const csvSource = "https://raw.githubusercontent.com/qcri/COVID19-MAL-Blacklist/master/disinfo/disinfo_latest.csv"
const list = [];

// Linking Disinfo Busters website with icon in main Google Chrome toolbar
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({
    url: 'https://disinfobusters.weebly.com/'
  })
})

const fetchList = () => {
  return fetch(csvSource)
    .then(function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: %s', response.status);
        return Promise.reject(new Error("Failed to fetch API"));
      }
      // Examine the text in the response
      return response.text()
    })
    .then((raw) => {
      return Promise.resolve(
        raw.split("\n")
          .map(row => row.split(" "))
          .map(arr => ({
            // domain: "*://" + arr[0] + "/*",
            domain: arr[0].toLowerCase(),
            score: +arr[1]
          }))
      )
    })
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}

chrome.webRequest.onBeforeRequest.addListener(async function(details) {

  if (list.length === 0) {
    const data = await fetchList()
    list.push(...data)
    console.log("Loaded data ", data)
  }

  if (details.url === csvSource) {
    return
  }

  // console.log("details", details)

  const url = new URL(details.url)
  if (list.filter(el => el.domain === url.host).length > 0) {
    console.log("Found %s!", url.host);
    chrome.tabs.executeScript(
      details.tabId,
      {
        file: 'content.js',
        runAt: 'document_end'
      }
    );
  }

},
  // filters
  {
    urls: [
      "*://*/*"
    ]
  },
  // extraInfoSpec
  ["blocking"]
);


// chrome.runtime.onMessage.addListener(
//   function(message, callback) {
//     if (message == "runContentScript") {
//       chrome.tabs.executeScript({
//         file: 'content.js'
//       });
//     }
//   });
//

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
