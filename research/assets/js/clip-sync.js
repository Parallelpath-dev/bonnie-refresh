/* Clips with synced lines, trimmed from ../pitch/assets/js/clip-sync.js.
   The one script on this page. See "Clip with synced lines" in CLAUDE.md.
   As a .media[data-clip] video plays, the .clip-line in the matching
   .clip-lines group whose data-from (seconds) has passed is shown.
   Without the script, the first line (is-on in the markup) shows. */
(function () {
  [].slice.call(document.querySelectorAll('.media[data-clip]')).forEach(function (fig) {
    var id = fig.getAttribute('data-clip');
    var v = fig.querySelector('video');
    var group = document.querySelector('.clip-lines[data-clip="' + id + '"]');
    if (!v || !group) return;
    var lines = [].slice.call(group.querySelectorAll('.clip-line'));
    function show() {
      var t = v.currentTime, on = lines[0];
      lines.forEach(function (l) { if (t >= parseFloat(l.getAttribute('data-from'))) on = l; });
      lines.forEach(function (l) { l.classList.toggle('is-on', l === on); });
    }
    v.addEventListener('timeupdate', show);
    v.addEventListener('seeked', show);
    v.addEventListener('ended', function () { v.currentTime = 0; show(); });
  });
})();
