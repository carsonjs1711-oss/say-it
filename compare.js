"use strict";

// Shared by the Say It app and the keyboard demo.

function tokens(text) {
  return [...text.matchAll(/\S+/g)].map((m) => ({ text: m[0], start: m.index, end: m.index + m[0].length }));
}

// Compare words ignoring capitals and punctuation, so "yeah" and "Yeah," count as the same
function wordKey(word) {
  return word.toLowerCase().replace(/’/g, "'").replace(/[^\p{L}\p{N}']/gu, "");
}

// Line up what was heard with the tidied message, word by word. Returns, for each
// tidied word, whether it changed and what was said instead, plus words that were
// dropped (shown before the tidied word they sat in front of).
function compare(heard, tidied) {
  const a = tokens(heard).map((t) => wordKey(t.text));
  const b = tokens(tidied).map((t) => wordKey(t.text));
  const lcs = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const heardWords = tokens(heard).map((t) => t.text);
  const words = b.map(() => ({ changed: false, was: "" }));
  const dropped = {};
  let changes = 0;
  let gone = [];
  let added = [];
  const flush = (nextIndex) => {
    if (added.length) {
      // Pair the new words with the last words said; anything said before those was dropped
      const extra = gone.length - added.length;
      if (extra > 0) {
        dropped[added[0]] = gone.slice(0, extra).join(" ");
        changes++;
      }
      added.forEach((j) => (words[j].changed = true));
      words[added[0]].was = gone.slice(Math.max(extra, 0)).join(" ");
      changes++;
    } else if (gone.length) {
      dropped[nextIndex] = gone.join(" ");
      changes++;
    }
    gone = [];
    added = [];
  };

  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      flush(j);
      i++;
      j++;
    } else if (j >= b.length || (i < a.length && lcs[i + 1][j] >= lcs[i][j + 1])) {
      gone.push(heardWords[i]);
      i++;
    } else {
      if (b[j]) added.push(j);
      j++;
    }
  }
  flush(b.length);
  return { words, dropped, changes };
}
