/* Bonnie Plants proposal deck.
   Standalone. Carried over from Parallel Path's pp-deck.js, the reading
   deck script, and pairs with assets/css/proposal.css.

   1. Builds the index beside the slides: the deck title from data-title
      on .deck, then one link per .chapter, numbered by its place in the
      deck, with a pip for every slide in the current chapter. The arrows
      at its foot move a chapter.
   2. Writes the frame on every slide. Never write it by hand.
      - The chapter label at the top, "02  Phases", from the chapter's
        place and its data-name.
      - The arrows that move one slide.
      - A line at the foot, shown only in print, that repeats the
        footer's labels and adds the page number.
      - A slide with data-kind="cover" gets no chapter label and no page
        number. A slide with data-frame="none" gets the arrows only.
   3. On a screen at least 1000 by 600, goes live. A sticky stage shows
      one slide at a time. Every slide is one scroll stop, and one wheel
      or trackpad gesture moves one slide, however long the gesture.
      Next: right or down arrow, Page Down, space, a scroll.
      Back: left or up arrow, Page Up. Home and End jump to the ends.
      The slides still to come in a chapter stack behind the current one.
      The footer shows the page number.
   4. Anywhere else, and in print, the slides stay a plain run. */
(function () {
  var deck = document.querySelector('[data-deck]');
  if (!deck) return;
  var index = deck.querySelector('.deck-index');
  var track = deck.querySelector('.deck-track');
  var foot = document.querySelector('.deck-foot');
  var pageOut = foot && foot.querySelector('.deck-page');

  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function slug(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  // Chapters and slides. A chapter with no id takes one from its name.
  var chapters = [].slice.call(deck.querySelectorAll('.chapter')).map(function (el, c) {
    var name = el.dataset.name || '';
    if (!el.id) el.id = slug(name) || 'chapter-' + (c + 1);
    el.setAttribute('aria-label', pad(c + 1) + ' ' + name);
    return { el: el, id: el.id, name: name, slides: [].slice.call(el.querySelectorAll('.slide')), at: 0 };
  });
  var flat = [];
  chapters.forEach(function (ch, c) {
    ch.first = flat.length;
    ch.slides.forEach(function (s, i) { flat.push({ c: c, i: i, s: s }); });
  });
  if (!flat.length) return;

  function btn(label, glyph, cls) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'deck-btn' + (cls ? ' ' + cls : '');
    b.setAttribute('aria-label', label);
    b.innerHTML = glyph;
    return b;
  }

  // 1. Index. The title, then one link per chapter.
  var home = document.createElement('a');
  home.className = 'deck-title';
  home.href = '#' + chapters[0].id;
  home.innerHTML = (deck.dataset.title || '').split('|').map(function (t) {
    return '<span>' + esc(t) + '</span>';
  }).join('');
  index.appendChild(home);

  var links = chapters.map(function (ch, c) {
    var a = document.createElement('a');
    a.className = 'deck-link';
    a.href = '#' + ch.id;
    var pips = '';
    for (var k = 0; k < ch.slides.length; k++) pips += '<i></i>';
    a.innerHTML = '<span class="n">' + pad(c + 1) + '</span><span>' + esc(ch.name) + '</span>' +
      (ch.slides.length > 1 ? '<span class="deck-pips">' + pips + '</span>' : '');
    index.appendChild(a);
    return a;
  });
  var ctrl = document.createElement('div');
  ctrl.className = 'deck-ctrl';
  var up = btn('Previous chapter', '&#8593;'), down = btn('Next chapter', '&#8595;');
  ctrl.appendChild(up); ctrl.appendChild(down);
  index.appendChild(ctrl);

  // 2. Frame. The footer's labels are the source for the print line.
  var labels = foot ? [].slice.call(foot.querySelectorAll('span:not(.deck-page)')).map(function (s) {
    return '<span>' + esc(s.textContent) + '</span>';
  }).join('') : '';

  flat.forEach(function (f, g) {
    var cover = f.s.dataset.kind === 'cover', bare = f.s.dataset.frame === 'none';
    function write(cls, html) {
      var el = document.createElement('div');
      el.className = cls;
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = html;
      f.s.appendChild(el);
    }
    if (!cover && !bare) write('slide-head label', pad(f.c + 1) + '  ' + esc(chapters[f.c].name));
    if (!bare) write('slide-foot label', labels + '<span class="slide-page">' + (cover ? '' : pad(g + 1)) + '</span>');

    var nav = document.createElement('div');
    nav.className = 'slide-nav';
    var back = btn('Previous slide', '&#8592;', 'back'), fwd = btn('Next slide', '&#8594;');
    back.hidden = g === 0;
    fwd.hidden = g === flat.length - 1;
    back.addEventListener('click', function () { go(g - 1, true); });
    fwd.addEventListener('click', function () { go(g + 1, true); });
    nav.appendChild(back); nav.appendChild(fwd);
    f.s.appendChild(nav);
  });

  // One stop per slide.
  var stops = flat.map(function () {
    var s = document.createElement('div');
    s.className = 'deck-stop';
    track.appendChild(s);
    return s;
  });

  var mq = window.matchMedia('(min-width: 1000px) and (min-height: 600px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var live = false, current = -1, frame = 0;

  // 3. Live. While live, each chapter's id moves to its first stop, so a
  // link to a chapter lands on its first slide.
  function setLive(on) {
    live = on;
    deck.classList.toggle('is-live', on);
    chapters.forEach(function (ch) {
      var stop = stops[ch.first];
      if (on) { ch.el.removeAttribute('id'); stop.id = ch.id; }
      else { stop.removeAttribute('id'); ch.el.id = ch.id; ch.el.classList.remove('is-on', 'is-past'); }
      ch.slides.forEach(function (s) {
        if (!on) { s.removeAttribute('data-depth'); s.removeAttribute('aria-hidden'); s.inert = false; }
      });
    });
    if (!on && pageOut) pageOut.textContent = '';
    current = -1;
    if (on) update();
  }

  function stageTop() { return parseFloat(getComputedStyle(deck.querySelector('.deck-stage')).top) || 0; }

  function position() {
    var stepH = stops.length > 1 ? stops[1].offsetTop - stops[0].offsetTop : 1;
    var p = (stageTop() - deck.getBoundingClientRect().top) / stepH;
    return Math.max(0, Math.min(flat.length - 1, Math.round(p)));
  }

  function paintChapter(c) {
    var ch = chapters[c];
    ch.slides.forEach(function (s, i) {
      var d = i - ch.at;
      s.dataset.depth = d < 0 ? 'past' : d > 2 ? 'far' : String(d);
      s.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
      s.inert = d !== 0;
    });
    [].slice.call(links[c].querySelectorAll('.deck-pips i')).forEach(function (pip, k) {
      pip.classList.toggle('on', k <= ch.at);
    });
  }

  function render(g) {
    if (g === current) return;
    current = g;
    var f = flat[g];
    chapters.forEach(function (ch, k) {
      ch.el.classList.toggle('is-on', k === f.c);
      ch.el.classList.toggle('is-past', k < f.c);
    });
    links.forEach(function (a, k) {
      a.classList.toggle('on', k === f.c);
      if (k === f.c) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
    });
    chapters[f.c].at = f.i;
    paintChapter(f.c);
    up.disabled = f.c === 0;
    down.disabled = f.c === chapters.length - 1;
    if (pageOut) pageOut.textContent = pad(g + 1) + ' / ' + pad(flat.length);
  }

  // The index is as tall as a slide.
  function measure() {
    var h = live ? flat[0].s.offsetHeight : 0;
    if (h) deck.style.setProperty('--slide-h', h + 'px'); else deck.style.removeProperty('--slide-h');
  }
  function update() { frame = 0; measure(); if (live) render(position()); }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }

  function go(g, keepFocus) {
    g = Math.max(0, Math.min(flat.length - 1, g));
    var top = window.scrollY + stops[g].getBoundingClientRect().top - stageTop();
    window.scrollTo({ top: top, behavior: reduce.matches ? 'auto' : 'smooth' });
    if (keepFocus) {
      var nav = flat[g].s.querySelector('.slide-nav');
      var f = nav && nav.querySelector('.deck-btn:not([hidden]):not(.back)') || nav && nav.querySelector('.deck-btn:not([hidden])');
      if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 50);
    }
  }

  function inDeck() {
    var r = deck.getBoundingClientRect(), t = stageTop();
    return r.top <= t + 2 && r.bottom >= t + 40;
  }

  // Keys move one slide.
  document.addEventListener('keydown', function (e) {
    if (!live || e.metaKey || e.ctrlKey || e.altKey || !inDeck()) return;
    var tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
    var g = position(), to = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') to = g + 1;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') to = g - 1;
    if (e.key === 'Home') to = 0;
    if (e.key === 'End') to = flat.length - 1;
    if (to === null || to < 0 || to > flat.length - 1) return;
    e.preventDefault();
    go(to);
  });

  // The wheel moves one slide per gesture. A gesture ends after a short
  // pause, so trackpad momentum and a fast spin count as one move.
  var lastWheel = 0, lockUntil = 0, used = false;
  window.addEventListener('wheel', function (e) {
    if (!live || e.ctrlKey || !inDeck()) return;
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
    var g = position(), dir = e.deltaY > 0 ? 1 : -1;
    if ((dir < 0 && g === 0) || (dir > 0 && g === flat.length - 1)) return;
    e.preventDefault();
    var now = Date.now();
    if (now - lastWheel > 160) used = false;
    lastWheel = now;
    if (used || now < lockUntil || Math.abs(e.deltaY) < 4) return;
    used = true;
    lockUntil = now + 650;
    go(g + dir);
  }, { passive: false });

  // Links to a chapter, from the index or anywhere else, land on its
  // first slide.
  function chapterOf(hash) {
    for (var k = 0; k < chapters.length; k++) if ('#' + chapters[k].id === hash) return k;
    return -1;
  }
  document.addEventListener('click', function (e) {
    var a = live && e.target.closest && e.target.closest('a[href^="#"]');
    var c = a ? chapterOf(a.getAttribute('href')) : -1;
    if (c < 0) return;
    e.preventDefault();
    go(chapters[c].first);
    try { history.replaceState(null, '', '#' + chapters[c].id); } catch (err) {}
  });
  up.addEventListener('click', function () { var c = flat[position()].c; go(chapters[Math.max(0, c - 1)].first); });
  down.addEventListener('click', function () { var c = flat[position()].c; go(chapters[Math.min(chapters.length - 1, c + 1)].first); });

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  function onMq() { setLive(mq.matches); }
  if (mq.addEventListener) mq.addEventListener('change', onMq); else mq.addListener(onMq);
  // 4. Print takes the plain run, one slide per page.
  window.addEventListener('beforeprint', function () { setLive(false); });
  window.addEventListener('afterprint', onMq);
  onMq();
  if (live && chapterOf(location.hash) > 0) {
    var startAt = chapters[chapterOf(location.hash)].first;
    requestAnimationFrame(function () {
      window.scrollTo({ top: window.scrollY + stops[startAt].getBoundingClientRect().top - stageTop(), behavior: 'instant' });
    });
  }
})();
