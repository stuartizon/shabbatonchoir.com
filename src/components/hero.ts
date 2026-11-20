// The hero image and the sizes it's served at, shared by the Hero component
// and the preload link the layout adds to the home page's head.
export { default as heroImage } from '../assets/hero.jpeg';

// Offer sizes from phones up to large retina desktops, capped at 2000px.
export const HERO_WIDTHS = [640, 960, 1280, 1600, 2000];

// The hero fills the screen width. From md up it also fills the screen
// height, cropped to cover, so on a wide-but-short window it can be wider
// than the screen: as wide as the photo's 3:2 shape needs (151vh).
export const HERO_SIZES = '(min-width: 768px) max(100vw, 151vh), 100vw';
