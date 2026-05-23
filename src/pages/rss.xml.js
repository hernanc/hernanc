import rss from '@astrojs/rss';
import { getPublishedPosts } from '../lib/posts';
import { SITE } from '../consts';
import { href } from '../lib/url';

export async function GET(context) {
  const posts = await getPublishedPosts();

  return rss({
    title: `${SITE.author} · Writing`,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: new URL(href(`/blog/${post.id}`), context.site).toString(),
    })),
  });
}
