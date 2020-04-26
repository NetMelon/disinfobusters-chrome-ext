
(function() {
  'use strict';

  // Add bubble to the top of the page.
  var div = document.createElement('div');

  div.style = "width: 100%; height: 4em; border: 2pt solid red; z-index: 999; position: absolute; top: 0px; margin: 0 auto; background-color: red; color: white; text-align: center; font-size: 36pt;";
  div.setAttribute('class', 'selection_bubble');

  const reflink = document.location.toString()
  div.innerHTML = "<p>\
    <b>Fake News Alert!</b> This site is suspected to be a fake news spreader!\
  </p>\
  <p>\
    Read more at <a href=\"https://www.disinfobusters.eu/stop?ref="+ reflink + "\">DisinfoBusters</a> \
  </p>"

  document.body.appendChild(div);
}());
