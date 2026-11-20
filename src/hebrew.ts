// Hebrew letters, points and punctuation (such as the geresh in זצ׳ל),
// plus the Hebrew presentation forms.
const HEBREW_RUN = /[֐-׿יִ-ﭏ]+(?:\s+[֐-׿יִ-ﭏ]+)*/g;

export interface TextPart {
  text: string;
  hebrew: boolean;
}

// Splits plain text into its English and Hebrew runs, so the Hebrew can be
// marked up with lang="he" for screen readers and search engines (#18).
export function splitHebrew(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;
  for (const match of text.matchAll(HEBREW_RUN)) {
    if (match.index > last) {
      parts.push({ text: text.slice(last, match.index), hebrew: false });
    }
    parts.push({ text: match[0], hebrew: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), hebrew: false });
  return parts;
}
