// The hero image and the sizes it's served at, shared by the Hero component
// and the preload link the layout adds to the home page's head.
export { default as heroImage } from '../assets/hero.jpeg';

// Offer sizes from phones up to large retina desktops, capped at 2000px.
export const HERO_WIDTHS = [640, 960, 1280, 1600, 2000];

// The hero is cropped to cover a box 460px tall on phones and 540px tall
// from md up, so it's at least as wide as the photo's 3:2 shape needs at
// that height (690px and 810px), and otherwise as wide as the page allows.
export const HERO_SIZES =
  '(min-width: 768px) max(min(100vw - 48px, 1232px), 810px), max(100vw - 24px, 690px)';
