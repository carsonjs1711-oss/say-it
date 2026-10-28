# Say It

A voice-to-text messaging app for people with dyslexia. You speak, it writes the message out properly, reads it back to you, and sends it from your own phone number through your normal Messages app.

## How it works

1. Pick who the message is to (or add someone).
2. Tap the red button and speak. Tap again when you've finished.
3. Your speech is turned into words (OpenAI speech-to-text), then tidied up by Claude: spelling, punctuation and misheard words are fixed, and self-corrections like "six, no wait, seven" are handled. Your own way of talking is kept.
4. The message is read back to you, with each word highlighted as it's spoken.
5. Change anything by voice ("change seven to half seven"), by typing, or go back to exactly what you said.
6. Tap Send. Your Messages app opens with the text filled in. Tap send there.

Apple and Google don't let apps send texts silently, so that last tap in Messages is always needed. It means the text really does come from your own number.

## Setup

It's a static web app with no build step. Host the folder anywhere with HTTPS (GitHub Pages works), open it on the phone, and use "Add to Home Screen".

In Settings, add:
- **Speech key**: an OpenAI API key. Without it, the phone's built-in speech recognition is used.
- **Tidy-up key**: an Anthropic API key. Without it, words go in exactly as heard.

Keys are stored only on the phone. This is fine for a prototype used by people you trust. For a public release, move the two API calls behind a small server so keys never sit on phones.

## Files

- `index.html`, `styles.css`, `app.js`: the app
- `sw.js`, `manifest.webmanifest`, `icons/`: home-screen install and offline support
