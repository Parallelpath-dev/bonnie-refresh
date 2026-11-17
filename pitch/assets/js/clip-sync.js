/* Clips with synced lines. See CLIP WITH SYNCED LINES in bonnie.css.
   - The play button starts a clip and shows the browser's controls.
   - Next starts it too: a .clip-cue with the clip's data-clip, placed as
     the second child of a data-build="step" group, plays the clip when
     the step lands. Back past that step pauses and rewinds it.
   - As the clip plays, the line whose data-from has passed fades in.
   - Focus goes back to the page, so the clicker still moves the deck. */
(function () {
  function start(fig, v) {
    fig.classList.add('is-playing');
    v.controls = true;
    if (v.ended) v.currentTime = 0;
    var p = v.play(); if (p && p.catch) p.catch(function () {});
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }
  [].slice.call(document.querySelectorAll('.media[data-clip]')).forEach(function (fig) {
    var id = fig.getAttribute('data-clip');
    var v = fig.querySelector('video');
    var b = fig.querySelector('.media-play');
    var group = document.querySelector('.clip-lines[data-clip="' + id + '"]');
    if (!v) return;
    var lines = group ? [].slice.call(group.querySelectorAll('.clip-line')) : [];
    function show() {
      if (!lines.length) return;
      var t = v.currentTime, on = lines[0];
      lines.forEach(function (l) { if (t >= parseFloat(l.getAttribute('data-from'))) on = l; });
      lines.forEach(function (l) { l.classList.toggle('is-on', l === on); });
    }
    if (b) b.addEventListener('click', function () { start(fig, v); });
    v.addEventListener('timeupdate', show);
    v.addEventListener('seeked', show);
    v.addEventListener('play', function () { fig.classList.add('is-playing'); v.controls = true; });

    // Play on Next. Arriving on the slide with the step already shown
    // (coming back with Back) does not start the clip.
    var cue = document.querySelector('.clip-cue[data-clip="' + id + '"]');
    var slide = fig.closest('.slide');
    if (!cue || !slide) return;
    var arrived = 0;
    new MutationObserver(function () {
      if (slide.classList.contains('is-on')) { if (!arrived) arrived = Date.now(); } else arrived = 0;
    }).observe(slide, { attributes: true, attributeFilter: ['class'] });
    var was = cue.classList.contains('is-in');
    new MutationObserver(function () {
      var now = cue.classList.contains('is-in');
      if (now === was) return;
      was = now;
      if (now && slide.classList.contains('is-on') && Date.now() - arrived > 150) start(fig, v);
      if (!now) { v.pause(); v.currentTime = 0; show(); }
    }).observe(cue, { attributes: true, attributeFilter: ['class'] });
  });
})();
