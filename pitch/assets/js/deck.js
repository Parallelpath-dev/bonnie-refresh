/* Bonnie Plants deck.
   Standalone. Takes the one-slide-per-gesture scrolling and the keys from
   Parallel Path's pp-deck.js, and leaves out its index and card stack,
   since the strip at the foot of every slide does that job.

   1. Writes the frame on every slide: the top line from data-top on
      .deck, the section strip from data-name on each .chapter, and the
      page number from the slide's place in the deck.
      - The cover (data-kind="cover") is page 1. A slide ahead of it,
        such as the opening wordmark, has no number and does not push
        the count. The cover, the last slide, and any section slide
        (data-kind="section") show no number. The cover marks no
        section in the strip.
      - Each section name in the strip is a link to that section's
        first slide. It lands there at step 0, like an address.
      - A slide with data-frame="none" gets no frame at all.
      - A slide with data-over="left 900" or data-over="right 640" has a
        block of another color under that part of the frame, measured
        in Figma pixels from the left edge. The frame is written twice
        and clipped at that line, so the part over the block takes
        --over-ink (Linen unless the slide sets it).
      - A page with no cover, such as layouts.html, numbers every slide
        from 1. There, data-sections on .deck names the strip's
        sections, and data-section="3" on a slide marks the third.
        Both are ignored on a deck whose chapters are its sections.
   2. On a screen wide and tall enough, shows one slide at a time.
      Next: right or down arrow, Page Down, space, or a scroll or swipe.
      Back: left or up arrow, Page Up. Home and End jump to the ends.
      F toggles full screen. The address ends in the page number, #12 on
      page 12, so a link can open on any slide. A slide ahead of the
      cover is #0.
   3. Runs the motion. A slide's moves come from data-move and data-build
      in its markup, and what it shows depends only on its step number.
      - Arriving forward, or by address, a slide is at step 0. Moves with
        no step play once. Each Next shows one more step, and after the
        last step Next goes to the following slide.
      - Back undoes one step, then goes to the previous slide, which
        arrives with every step shown.
      - data-build on a group brings its children in one after another.
        data-build="step" holds each child after the first for a Next.
      - The look and timing of every move is in bonnie.css under MOTION.
   4. Anywhere else, and in print, the slides stay a plain run with
      every slide finished. */
(function () {
  var deck = document.querySelector('[data-deck]');
  if (!deck) return;

  var topLine = (deck.dataset.top || '').split('|');
  var chapters = [].slice.call(deck.querySelectorAll('.chapter'));
  // The strip lists the chapters, unless the page names its sections
  // itself (layouts.html does, since its chapters are not the talk's).
  var own = !!deck.dataset.sections;
  var names = own ? deck.dataset.sections.split('|')
                  : chapters.map(function (ch) { return ch.dataset.name || ''; });
  var slides = [];
  chapters.forEach(function (ch, c) {
    [].slice.call(ch.querySelectorAll('.slide')).forEach(function (s) { slides.push({ s: s, c: c }); });
  });
  if (!slides.length) return;

  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  // Page 1 is the cover. Without one, it is the first slide.
  var cover = -1;
  slides.forEach(function (f, i) { if (cover < 0 && f.s.dataset.kind === 'cover') cover = i; });
  var first = cover < 0 ? 0 : cover;
  function pageOf(i) { return i - first + 1; }

  // The frame is 48 in from each side of a 1920 slide. These clip a
  // frame element at a line x Figma pixels from the slide's left edge.
  var FAR = '-9999px';
  function keepLeft(x)  { return 'inset(' + FAR + ' calc(' + (1872 - x) + ' * var(--u)) ' + FAR + ' ' + FAR + ')'; }
  function keepRight(x) { return 'inset(' + FAR + ' ' + FAR + ' ' + FAR + ' calc(' + (x - 48) + ' * var(--u)))'; }

  // The first slide of each section, for the strip's links. A page whose
  // strip names sections it does not hold, such as layouts.html, has
  // none, and its names stay plain text.
  var firstOf = names.map(function () { return -1; });
  if (!own) slides.forEach(function (f, i) { if (firstOf[f.c] < 0) firstOf[f.c] = i; });

  // 1. Frame.
  slides.forEach(function (f, i) {
    var page = pageOf(i), kind = f.s.dataset.kind;
    f.s.dataset.page = page;
    if (f.s.dataset.frame === 'none') return;
    var bare = page < 1 || kind === 'section' || (cover >= 0 && (i === cover || i === slides.length - 1));
    var on = own ? (parseInt(f.s.dataset.section, 10) || 0) - 1 : f.c;
    if (kind === 'cover') on = -1;
    var topHtml = topLine.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
    // The strip. A second copy, written over a block, is for the eye
    // only, so the Tab key skips its links.
    function stripHtml(second) {
      return '<ol>' + names.map(function (n, k) {
        var text = pad(k + 1) + '  ' + esc(n), to = firstOf[k];
        if (to >= 0) {
          text = '<a href="#' + pageOf(to) + '" data-to="' + to + '"' + (second ? ' tabindex="-1"' : '') + '>' + text + '</a>';
        }
        return '<li' + (k === on ? ' class="on"' : '') + '>' + text + '</li>';
      }).join('') + '</ol><span class="frame-page">' + (bare ? '' : pad(page)) + '</span>';
    }
    // The frame goes in last, so it sits over a full-bleed photo.
    function write(cls, html, clip, hidden) {
      var el = document.createElement('div');
      el.className = cls;
      if (hidden) el.setAttribute('aria-hidden', 'true');
      el.innerHTML = html;
      if (clip) el.style.clipPath = clip;
      f.s.appendChild(el);
    }
    // "left 900": the block runs from the left edge to 900.
    // "right 640": it runs from 640 to the right edge.
    var over = (f.s.dataset.over || '').split(' '), x = parseFloat(over[1]);
    var split = (over[0] === 'left' || over[0] === 'right') && !isNaN(x);
    var onBlock = split ? (over[0] === 'left' ? keepLeft(x) : keepRight(x)) : '';
    var offBlock = split ? (over[0] === 'left' ? keepRight(x) : keepLeft(x)) : '';
    write('frame-top', topHtml, offBlock, true);
    write('frame-strip', stripHtml(false), offBlock, false);
    if (split) {
      write('frame-top is-over', topHtml, onBlock, true);
      write('frame-strip is-over', stripHtml(true), onBlock, true);
    }
  });

  // 2. Motion. Read each slide's moves once, in the order they are
  // written. A move's step says when it shows. Its place in the step, n,
  // and the pauses ahead of it, g, set how long it waits (see MOTION in
  // bonnie.css).
  // carry is the sixth move, added for bonnie-rfp-v2.html (Michael's slides). See THE CARRY
  // in bonnie.css. land is the seventh, added for bonnie-rfp-v3.html. See THE LAND.
  var ENTER = { fade: 1, rise: 1, draw: 1, carry: 1, land: 1 };
  slides.forEach(function (f) {
    f.moves = []; f.dims = []; f.steps = 0; f.step = 0;
    var seq = {};
    function queue(step) { return seq[step] || (seq[step] = { n: 0, g: 0, prev: '' }); }
    function enter(el, step, n, g) {
      var kind = ENTER[el.dataset.move] ? el.dataset.move : 'fade';
      el.classList.add('mv', 'mv-' + kind);
      el.style.setProperty('--n', n);
      el.style.setProperty('--g', g);
      f.moves.push({ el: el, step: step });
      f.steps = Math.max(f.steps, step);
    }
    // A dim element is on screen from the start and dims one step later.
    function dim(el, step) {
      f.dims.push({ el: el, at: step + 1 });
      f.steps = Math.max(f.steps, step + 1);
    }
    // data-later="1" on a move holds it one step past its group's. A land
    // inside a group that fades in uses it: the group arrives, then on
    // the next step the element travels.
    function place(el, step, n, g) {
      step += parseInt(el.dataset.later, 10) || 0;
      if (el.dataset.move === 'dim') dim(el, step); else enter(el, step, n, g);
    }
    function walk(node) {
      [].slice.call(node.children).forEach(function (el) {
        if (el.hasAttribute('data-build')) {
          var byKey = el.dataset.build === 'step';
          [].slice.call(el.children).forEach(function (kid, k) {
            var step = byKey ? k : 0, q = queue(step);
            // A timed build waits a beat after whatever came before it.
            if (!byKey && k === 0 && q.prev) q.g++;
            var n = q.n++, inner = [].slice.call(kid.querySelectorAll('[data-move]'));
            // A child with moves written inside it is only a group. Those
            // moves play together, in the child's turn, and the child
            // itself stays put. Any other child fades, or uses its own move.
            if (kid.hasAttribute('data-move') || !inner.length) place(kid, step, n, q.g);
            inner.forEach(function (el2) { place(el2, step, n, q.g); });
            q.prev = byKey ? 'move' : 'build';
          });
        } else if (el.hasAttribute('data-move')) {
          var q0 = queue(0);
          // A move after a timed build waits a beat for it to finish.
          if (el.dataset.move === 'dim') { dim(el, 0); return; }
          if (q0.prev === 'build') q0.g++;
          enter(el, 0, q0.n++, q0.g);
          q0.prev = 'move';
        } else {
          walk(el);
        }
      });
    }
    walk(f.s);
  });

  // What a slide shows is set by its step alone.
  function build(f, step) {
    f.step = step;
    f.moves.forEach(function (m) { m.el.classList.toggle('is-in', m.step <= step); });
    f.dims.forEach(function (d) { d.el.classList.toggle('is-dim', step >= d.at); });
  }
  function unbuild(f) {
    f.step = 0;
    f.moves.forEach(function (m) { m.el.classList.remove('is-in'); });
    f.dims.forEach(function (d) { d.el.classList.remove('is-dim'); });
  }

  // 3. Presenting.
  var mq = window.matchMedia('(min-width: 900px) and (min-height: 480px)');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var live = false, cur = 0;

  // The length of the dissolve between slides, from --move-cut.
  function cutMs() {
    if (calm.matches) return 0;
    var v = getComputedStyle(deck).getPropertyValue('--move-cut').trim(), n = parseFloat(v);
    return isNaN(n) ? 0 : (/ms$/.test(v) ? n : n * 1000);
  }

  // The address carries the page number. #0 is a slide ahead of the cover.
  function fromHash() {
    var n = parseInt(location.hash.slice(1), 10), i = n - 1 + first;
    return !isNaN(n) && i >= 0 && i < slides.length ? i : null;
  }

  // Leaving a slide stops anything playing on it.
  function stopMedia(s) {
    [].slice.call(s.querySelectorAll('video')).forEach(function (v) { v.pause(); });
    [].slice.call(s.querySelectorAll('.media > iframe')).forEach(function (fr) { var src = fr.src; fr.src = src; });
  }

  // The photos are large. Decoding the next slide's ahead of time keeps
  // them from popping in after the slide has turned.
  function warm(i) {
    if (i < 0 || i >= slides.length) return;
    [].slice.call(slides[i].s.querySelectorAll('img')).forEach(function (im) {
      if (im.decode) im.decode().catch(function () {});
    });
  }

  // The slide being dissolved off, if any, and the timer that ends it.
  var leaving = null, leaveTimer = 0;
  function settle() {
    if (!leaving) return;
    clearTimeout(leaveTimer);
    leaving.s.classList.remove('is-leaving');
    unbuild(leaving);
    leaving = null;
  }

  // back is true when the slide is reached by stepping back. It then
  // arrives with every step shown. Any other way it arrives at step 0.
  function show(i, back) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    settle();
    var old = slides[cur], f = slides[i], cut = i !== cur && live ? cutMs() : 0;
    if (i !== cur) stopMedia(old.s);
    old.s.classList.remove('is-on');
    if (cut) {
      old.s.classList.add('is-leaving');
      leaving = old;
      leaveTimer = setTimeout(settle, cut + 80);
    } else if (i !== cur) {
      unbuild(old);
    }
    cur = i;
    // Set the slide's starting state with nothing animating: every step
    // shown when stepping back, every move held back otherwise. Then let
    // the moves at step 0 play.
    deck.classList.add('is-setting');
    if (back) build(f, f.steps); else unbuild(f);
    f.s.classList.add('is-on');
    void f.s.offsetWidth;
    deck.classList.remove('is-setting');
    if (!back) build(f, 0);
    warm(cur + 1);
    try { history.replaceState(null, '', '#' + pageOf(cur)); } catch (e) {}
  }

  // Next and Back: one step within the slide, then on to its neighbor.
  function step(d) {
    var f = slides[cur];
    if (d > 0 && f.step < f.steps) return build(f, f.step + 1);
    if (d < 0 && f.step > 0) return build(f, f.step - 1);
    var to = cur + d;
    if (to >= 0 && to < slides.length) show(to, d < 0);
  }

  function setLive(on) {
    settle();
    live = on;
    deck.classList.toggle('is-live', on);
    slides.forEach(function (f, k) { f.s.classList.toggle('is-on', on && k === cur); });
    if (on) show(cur);
  }

  function inMedia(el) { return el && el.closest && el.closest('.media, video, iframe'); }

  document.addEventListener('keydown', function (e) {
    if (!live || e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || inMedia(e.target)) return;
    var k = e.key, d = 0, to = null;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ') d = 1;
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') d = -1;
    else if (k === 'Home') to = 0;
    else if (k === 'End') to = slides.length - 1;
    else if (k === 'f' || k === 'F') {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
      return;
    }
    if (!d && to === null) return;
    e.preventDefault();
    if (d) step(d); else show(to);
  });

  // A wheel or trackpad gesture moves one slide, then waits for the
  // gesture to finish, so momentum never skips a slide.
  var lastWheel = 0, lockUntil = 0, used = false;
  window.addEventListener('wheel', function (e) {
    if (!live || e.ctrlKey) return;
    var d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    e.preventDefault();
    var now = Date.now();
    if (now - lastWheel > 160) used = false;
    lastWheel = now;
    if (used || now < lockUntil || Math.abs(d) < 4) return;
    used = true;
    lockUntil = now + 650;
    step(d > 0 ? 1 : -1);
  }, { passive: false });

  // A swipe on a touch screen.
  var tx = null, ty = null;
  window.addEventListener('touchstart', function (e) {
    if (!live || e.touches.length !== 1) return;
    tx = e.touches[0].clientX; ty = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchend', function (e) {
    if (!live || tx === null) return;
    var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    tx = ty = null;
    var d = Math.abs(dx) > Math.abs(dy) ? -dx : -dy;
    if (Math.abs(d) > 40) step(d > 0 ? 1 : -1);
  }, { passive: true });

  // A section name in the strip jumps to that section's first slide. In
  // the slideshow it arrives at step 0. In the stacked scroll the page
  // scrolls to it. A click with a modifier key is left to the browser,
  // so the link can still open in a new tab.
  deck.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('.frame-strip a') : null;
    if (!a || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    var i = parseInt(a.dataset.to, 10);
    if (isNaN(i) || !slides[i]) return;
    if (live) {
      if (i !== cur) show(i);
    } else {
      cur = i;
      slides[i].s.scrollIntoView();
      try { history.replaceState(null, '', '#' + pageOf(i)); } catch (err) {}
    }
  });
  // Over a block the strip is drawn twice. Keyboard focus lands on the
  // first copy, so pass its look to the matching link in the second.
  function mirror(e) {
    var a = e.target.closest ? e.target.closest('.frame-strip a') : null;
    if (!a) return;
    var twin = a.closest('.slide').querySelector('.frame-strip.is-over a[data-to="' + a.dataset.to + '"]');
    if (twin && twin !== a) twin.classList.toggle('is-lit', e.type === 'focusin' && a.matches(':focus-visible'));
  }
  deck.addEventListener('focusin', mirror);
  deck.addEventListener('focusout', mirror);

  window.addEventListener('hashchange', function () {
    var n = fromHash();
    if (live && n !== null && n !== cur) show(n);
  });

  function onMq() { setLive(mq.matches); }
  if (mq.addEventListener) mq.addEventListener('change', onMq); else mq.addListener(onMq);
  window.addEventListener('beforeprint', function () { setLive(false); });
  window.addEventListener('afterprint', onMq);

  var start = fromHash();
  if (start !== null) cur = start;
  onMq();
  if (!live && start !== null) slides[start].s.scrollIntoView();
})();

/* MICHAEL'S SLIDES. A .wall with .rolls scrolls without end (see THE
   ROLL in bonnie.css). For the loop to have no seam, each column needs
   its images twice. This writes the second set, hidden from screen
   readers, so the markup lists each image once. A page with no such
   wall is left alone. */
(function () {
  [].slice.call(document.querySelectorAll('.wall.rolls .wall-col')).forEach(function (col) {
    [].slice.call(col.children).forEach(function (kid) {
      var twin = kid.cloneNode(true);
      twin.setAttribute('aria-hidden', 'true');
      col.appendChild(twin);
    });
    col.classList.add('is-doubled');
  });
})();

/* MICHAEL'S SLIDES. A .screens box shows captures of one page a screen
   at a time (see THE SCREENS in bonnie.css). While its slide is up,
   this moves to the next screen every --secs seconds and goes back to
   the first after the last. Each time the slide arrives it starts from
   the first screen. In the stacked scroll no slide is ever up, so the
   first screen stays. */
(function () {
  [].slice.call(document.querySelectorAll('.screens')).forEach(function (box) {
    var kids = [].slice.call(box.children), slide = box.closest('.slide');
    if (!kids.length) return;
    var secs = parseFloat(getComputedStyle(box).getPropertyValue('--secs')) || 3;
    var cur = 0, up = false, since = 0;
    // The screen being left stays under the one fading in.
    function show(n) {
      kids.forEach(function (k, i) {
        k.classList.toggle('is-under', i === cur && n !== cur);
        k.classList.toggle('is-on', i === n);
      });
      cur = n;
    }
    show(0);
    box.classList.add('is-run');
    if (kids.length < 2 || !slide) return;
    setInterval(function () {
      var on = slide.classList.contains('is-on'), now = Date.now();
      if (on && !up) { show(0); since = now; }
      else if (on && now - since >= secs * 1000) { show((cur + 1) % kids.length); since = now; }
      up = on;
    }, 100);
  });
})();
