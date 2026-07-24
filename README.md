# Affinity Cellular — Savings Calculator Landing Page

A pixel-matched, fully responsive landing page recreating the Affinity Cellular
"See How Much You Could Save" design. Built with plain HTML, CSS, and vanilla JS —
no build step, deployable as static files.

## Features
- **Live countdown timer** (evergreen, resets automatically)
- **Interactive savings calculator** — carrier, monthly-bill slider, line count,
  data usage, and keep-phone options recompute the personalized results panel
  with an animated count-up on submit
- **Responsive** layout for desktop, tablet, and mobile
- Semantic markup, accessible form controls, click-to-call links

## Structure
```
index.html        # Page markup
css/styles.css    # All styling
js/script.js      # Slider, line toggle, countdown, savings calc
images/           # Photos (royalty-free placeholders — swap for licensed assets)
```

## Notes on images
The photos in `images/` are royalty-free placeholders sourced to match the
original design (senior couple, three reviewer headshots, a headset specialist).
Replace any file in `images/` with your own licensed asset using the same filename
to update the page — no code changes required.

## Local preview
Just open `index.html` in a browser, or serve the folder:
```
python3 -m http.server 8000
```

*This is a demonstration marketing page.*
