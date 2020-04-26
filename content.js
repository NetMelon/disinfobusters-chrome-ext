
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
    Read more at <a href=\"http://www.disinfobusters.eu/stop?ref="+ reflink + "\">DisinfoBusters</a> \
  </p><img src='https://disinfobusters.weebly.com/uploads/1/9/6/4/19641989/disnfobusters-logo-large_orig.png'>"

  document.body.appendChild(div);
}());
