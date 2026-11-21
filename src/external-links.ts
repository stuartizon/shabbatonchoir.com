import type { HastPluginDefinition } from 'satteri';

// Opens links in Markdown content to other websites in a new tab, like the
// site's other external links.
export const externalLinks: HastPluginDefinition = {
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href === 'string' && /^https?:\/\//.test(href)) {
        ctx.setProperty(node, 'target', '_blank');
        ctx.setProperty(node, 'rel', 'noreferrer');
      }
    },
  },
};
