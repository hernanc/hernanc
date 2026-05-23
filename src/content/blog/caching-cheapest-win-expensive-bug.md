---
title: "Caching: the cheapest win, the most expensive bug"
description: "Caching is the highest leverage performance tool most backends have, and the source of the bugs that are hardest to reason about. Notes on how I think about cache layers in production."
pubDate: 2026-04-12
tags: ["caching", "performance", "engineering"]
draft: false
---

Caches are the part of the stack that pay you back the fastest and bite you
the hardest. A single Redis layer can take a backend from "concerning" to
"comfortable" in an afternoon. The same layer, two months later, is where
you spend a Tuesday morning explaining why some customers see stale data
while others don't.

I have written a lot of caches. The mistakes I keep making, in order of how
often I make them.

## Cache the answer, not the inputs

The instinct is to cache at the boundary the call is most expensive at. A
common version of that mistake is caching at the database layer, where the
keys end up being whatever the application was about to ask. The cache hits
look great. The bugs come from the dozen places that read the same data
through slightly different queries and never benefit.

Cache at the layer where the *answer* is shaped. The function that returns
the user's feed. The endpoint that returns the rendered settings page. That
layer is the one users see, and it is the layer where invalidation is
tractable.

## TTLs are not a strategy, they are a fallback

A cache with a TTL and no other invalidation is a cache that lies for up to
the TTL. That is fine for some data and a footgun for others.

A more useful default:

- Write-through invalidation as the primary mechanism. When the source of
  truth changes, the cache entry gets removed in the same code path.
- A short TTL as a backstop, sized to the worst staleness you can defend.
- A monotonic version key in the cache namespace, so a deploy can flush
  whole categories of entries by bumping the version.

```python
def cache_key(user_id: int, version: str = "v3") -> str:
    return f"feed:{version}:{user_id}"
```

The version-in-the-key trick is unglamorous and saves you every time a
schema or rendering change makes old entries dangerous. Bumping the version
is a one-line invalidation of everything that depends on the old shape.

## Stampedes are not a tail risk

The first time a popular cache key expires under load is a story most teams
have. The pattern is always the same: the key drops, a thousand requests
arrive in the next two seconds, all of them recompute it, the database has
a bad ten seconds.

Two cheap defenses get rid of most of it:

- A small randomized jitter on TTLs so popular keys don't all expire at
  once.
- A single-flight or lock-based pattern around the recompute, so only one
  request does the work and the rest wait.

Neither is hard to add. Both pay back permanently.

## Cache failures should look like cache failures

The worst caching bugs are the ones where the cache returns the wrong answer
rather than no answer. A cache that misses is recoverable. A cache that
serves yesterday's user permissions is a security incident.

When in doubt, design the cache so that the worst failure mode is "this is
slow", not "this is wrong". A miss is a slowdown. A bad invalidation can be
much worse.

## The boring summary

Cache the layer users see. Invalidate on write. Use TTLs as a backstop.
Plan for the stampede. Make sure failure modes look like slowness, not
wrong answers. None of this is exciting, which is the point.
