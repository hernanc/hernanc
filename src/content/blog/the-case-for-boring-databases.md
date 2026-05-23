---
title: "The case for boring databases"
description: "Postgres can do almost everything most products need. The right time to reach for something else is rare, and not when you think it is."
pubDate: 2025-05-10
tags: ["databases", "postgres", "engineering"]
draft: false
---

Every couple of years a new database becomes fashionable. The pitch is always
the same shape: it scales better, it's faster on workload X, it's more
cloud-native, it's purpose-built for the new thing. The pitch is often true.
What the pitch leaves out is the cost of running a second datastore.

For most products, that cost is the dominant factor, and Postgres is still
the right answer.

## What Postgres covers without you asking nicely

The reason Postgres keeps winning is that the features people reach for new
databases to get usually exist inside it, two releases later, with a
permissive license and a community that has used them in anger.

- JSON columns and indexed JSON access cover most documents.
- Full-text search is built in and is good enough for the vast majority of
  search features that pretend they need Elasticsearch.
- `LISTEN`/`NOTIFY` covers a surprising amount of lightweight pub/sub.
- Logical replication covers a lot of what you would otherwise reach for a
  change-data-capture pipeline to do.
- Partitioning covers a lot of what you would otherwise reach for a sharded
  store to do.

None of these are the very best in class for their specific feature. They
don't need to be. They need to be good enough to keep your stack at one
datastore.

## When it actually is time to leave

A specialized datastore earns its keep when you have a workload Postgres
cannot serve at the latency or scale you need, *and you have measured the
gap*. Not when you suspect the gap exists.

I keep a short mental checklist before agreeing to add a new datastore:

```
1. Which exact query or pattern is failing on Postgres?
2. What does the plan look like, and what have we tried?
3. Is this a config, index, or schema problem, or a fundamental one?
4. If we add a new store, who runs it at 3 a.m.?
```

If the first two questions don't have specific answers, the team isn't
ready to add a database. They're ready to spend a week with `EXPLAIN
ANALYZE` and a profiler.

## Boring as a feature

The case for boring databases isn't an argument against ambition. It's an
argument for spending your novelty budget where it pays off most. Most
products do not become great because they used the trendiest store. They
become great because the team avoided the kinds of operational surprises a
second datastore introduces.

The default answer is Postgres. The interesting question is what evidence
would change that answer.
