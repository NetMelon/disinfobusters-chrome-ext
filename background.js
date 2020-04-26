'use strict';

const csvSource = "https://raw.githubusercontent.com/qcri/COVID19-MAL-Blacklist/master/disinfo/disinfo_latest.csv"
const list = [];
let lock = null

// Linking Disinfobusters website with icon in Google Chrome toolbar
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({
    url: 'https://disinfobusters.eu/'
  })
})

const showBanner = (details) => {
  chrome.tabs.insertCSS(details.tabId, { file: 'content.css' }, () => {
    chrome.tabs.executeScript(details.tabId, { file: 'content.js' });
  });
}

const fetchList = async () => {

  // await other requests
  if (lock !== null) {
    return await lock
  }

  lock = fetch(csvSource)
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

  return lock
}

const loadCache = async () => {
  if (list.length === 0 && lock === null) {
    const data = await fetchList()
    list.push(...data)
    console.log("Loaded %s domains", data.length)
  }
}

chrome.webRequest.onBeforeRequest.addListener(async function(details) {

  await loadCache()

  if (details.url === csvSource) {
    return
  }

  // console.log("details", details)

  const url = new URL(details.url)
  if (list.filter(el => el.domain === url.host).length > 0) {
    console.log("Found %s!", url.host);
    showBanner(details)
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