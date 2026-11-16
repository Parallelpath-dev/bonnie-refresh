/* Clip with synced lines. See CLIP WITH SYNCED LINES in bonnie.css.
   The play button starts the clip and shows the browser's controls.
   As the clip plays, the line whose data-from has passed fades in.
   Focus goes back to the page, so the clicker still moves the deck. */
(function () {
  [].slice.call(document.querySelectorAll('.media[data-clip]')).forEach(function (fig) {
    var v = fig.querySelector('video');
    var b = fig.querySelector('.media-play');
    var group = document.querySelector('.clip-lines[data-clip="' + fig.getAttribute('data-clip') + '"]');
    if (!v || !group) return;
    var lines = [].slice.call(group.querySelectorAll('.clip-line'));
    function show() {
      var t = v.currentTime, on = lines[0];
      lines.forEach(function (l) { if (t >= parseFloat(l.getAttribute('data-from'))) on = l; });
      lines.forEach(function (l) { l.classList.toggle('is-on', l === on); });
    }
    if (b) b.addEventListener('click', function () {
      fig.classList.add('is-playing');
      v.controls = true;
      v.play();
      b.blur(); v.blur();
    });
    v.addEventListener('timeupdate', show);
    v.addEventListener('seeked', show);
    v.addEventListener('play', function () { fig.classList.add('is-playing'); v.controls = true; });
  });
})();
