(function() {
  'use strict';

  const id = "disinfobusters-ext"

  const exists = () => document.getElementById(id) !== null

  if (exists()) return

  fetch(chrome.extension.getURL('/content.html'))
    .then(response => response.text())
    .then(html => {

      // other code
      // eg update injected elements,
      // add event listeners or logic to connect to other parts of the app

      var div = document.createElement('div');
      div.id = id
      const reflink = document.location.toString()
      div.innerHTML = html.replace("{referer}", encodeURIComponent(reflink))

      if (!exists()) {
        document.body.appendChild(div);
      }

    }).catch(err => {
      console.error("Failed to load /content.html")
    });
}());
