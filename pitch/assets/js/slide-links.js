/* Links between slides. An <a data-slide="id"> points at the slide with
   that id. Its href is set to the slide's current page number, so the
   link keeps working when slides are added or moved. The deck already
   follows the address, so a click jumps there; the browser's Back
   (Alt + Left) returns to where you were. */
(function () {
  var slides = [].slice.call(document.querySelectorAll('.deck .slide'));
  var cover = slides.findIndex(function (s) { return s.dataset.kind === 'cover'; });
  if (cover < 0) cover = 0;
  [].slice.call(document.querySelectorAll('a[data-slide]')).forEach(function (a) {
    var t = document.getElementById(a.getAttribute('data-slide'));
    var i = slides.indexOf(t);
    if (i >= 0) a.setAttribute('href', '#' + (i - cover + 1));
  });
})();
