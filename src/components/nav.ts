// The site's main pages, in the order both headers list them.
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/music', label: 'Music' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/history', label: 'History' },
  { href: '/contact', label: 'Contact' },
];

// Whether a nav link is for the page at this path. With build.format 'file'
// a page can be built as /music.html, and the home page as /index.html.
export function isCurrent(href: string, pathname: string): boolean {
  const path = pathname.replace(/(index)?\.html$/, '').replace(/\/$/, '');
  return (path || '/') === href;
}
