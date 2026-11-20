import type { IconName } from '../icons';

// The choir's social and streaming accounts, in the order the footer shows
// them.
export const SOCIAL_LINKS: { service: string; name: IconName; href: string }[] =
  [
    {
      service: 'Facebook',
      name: 'facebook',
      href: 'https://www.facebook.com/shabbatonchoir',
    },
    { service: 'X', name: 'x', href: 'https://x.com/shabbatonchoir' },
    {
      service: 'YouTube',
      name: 'youtube',
      href: 'https://www.youtube.com/user/ShabbatonChoir',
    },
    {
      service: 'Spotify',
      name: 'spotify',
      href: 'https://open.spotify.com/artist/3UZxQiOiQL8bgl4Zc4R9vk',
    },
    {
      service: 'Apple Music',
      name: 'apple-music',
      href: 'https://music.apple.com/gb/artist/shabbaton-choir/449897420',
    },
    {
      service: 'Amazon Music',
      name: 'amazon',
      href: 'https://music.amazon.co.uk/artists/B005CSNERG/shabbaton-choir',
    },
  ];
