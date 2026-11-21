import { SOCIAL_LINKS } from './components/social';

// JSON-LD that tells search engines about the choir and its albums, so they
// can show its details, charity number and music in results.

type Node = Record<string, unknown>;

const SITE = 'https://www.shabbatonchoir.com/';

// The choir is one organisation that is both a music group and a
// registered charity, so it gets both types rather than two separate nodes.
export const choir: Node = {
  '@type': ['MusicGroup', 'NGO'],
  '@id': `${SITE}#choir`,
  name: 'Shabbaton Choir',
  url: SITE,
  logo: `${SITE}logo.svg`,
  foundingDate: '1990',
  identifier: {
    '@type': 'PropertyValue',
    propertyID: 'Charity Commission for England and Wales charity number',
    value: '1058256',
  },
  sameAs: SOCIAL_LINKS.map(({ href }) => href),
};

/**
 * The nodes as the body of a JSON-LD script. Escapes "<" so no text can
 * close the script early.
 */
export function toJsonLd(nodes: Node[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': nodes,
  }).replace(/</g, '\\u003c');
}
