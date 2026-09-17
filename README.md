# OccultFreakIO // All Seeing Eye (2008 Horror ARG)

A gritty, minimalist 2008 found-footage & analog horror landing page for an Alternate Reality Game (ARG).

---

## 🖼️ How to Change the Background Image

Open [`style.css`](style.css) and look at line 1:

```css
:root {
  /* Put your background image path or URL here: */
  --bg-image: url('assets/bg-horror.jpg');
  --bg-opacity: 0.55;       /* 0.0 to 1.0 */
  --bg-darkness: 0.70;      /* Darkness overlay strength */
}
```

- **Use a local image**: Place your image in the `assets/` folder and set `--bg-image: url('assets/your-photo.jpg');`.
- **Use a web image**: Set `--bg-image: url('https://example.com/creepy-photo.jpg');`.
- **No image**: Set `--bg-image: none;`.

---

## 📺 Features

1. **Background Noise Canvas**: Real-time simulated analog TV / CCD sensor pixel noise running at 22 fps.
2. **Simple & Unsettling Design**: Focused entirely on the **All seeing eye** text and simple retro password input box.
3. **Audio Synthesis**: Includes ambient tape drone hiss, typewriter keystrokes, and distorted tape audio on incorrect password submissions.
4. **Customizable Passwords**: Edit riddles and passwords directly in `ARG_CONFIG.passwords` inside [`script.js`](script.js).
