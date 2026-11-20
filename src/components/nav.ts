// The site's main pages, in the order both headers list them.
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/music', label: 'Music' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/history', label: 'History' },
  { href: '/contact', label: 'Contact' },
];

/**
 * Whether a link points at the page being built. With build.format 'file',
 * pages build as /music.html and the home page as /index.html.
 */
export function isCurrent(href: string, pathname: string) {
  return pathname.replace(/(index)?\.html$/, '') === href;
}
