---
title: "Latency budgets, and how to argue for them"
description: "Setting an explicit latency budget for a user-facing path changes how engineering and product talk to each other. Notes on what a good budget looks like and how to negotiate one."
pubDate: 2026-03-29
tags: ["performance", "engineering", "latency"]
draft: false
---

For most product surfaces, latency lives in a strange place. Everyone agrees
it matters. Nobody owns it. It only becomes a topic when it gets bad enough
to surface in a meeting, and by then the conversation is reactive and
emotional.

A latency budget changes that. Setting an explicit number for "what is fast
enough on this path" turns latency into something engineering and product
can plan against, the same way they plan against any other commitment.

## What a useful budget looks like

A latency budget is a per-route, per-percentile target with a window. The
shape that tends to work:

> The `/feed` endpoint should respond in under 250 ms at P99 over a rolling
> 28-day window.

Each piece does a job:

- **Per route** keeps the conversation specific. Site-wide averages hide the
  surfaces that matter.
- **Per percentile**, usually P95 or P99, captures the experience users
  actually have rather than the median.
- **Rolling window** prevents single bad afternoons from being either
  ignored or overweighted.

The exact numbers depend on the product. The format does not.

## Where the budget gets spent

Once a budget exists, every system on the path has a share of it. A request
that has a 250 ms ceiling and goes through a load balancer, an application,
a database, and a cache cannot afford to spend 100 ms on any one hop unless
the others give it room.

That accounting changes how features get built. "Add a new query to this
page" stops being a yes/no question and becomes "the page has 60 ms of room
before it breaches its budget, this query needs to fit in 25 of those, can
we make it fit?". The trade-off is concrete instead of vague.

## Negotiating with product

The conversation I have most often when introducing a budget is with a
product manager who is worried it will block features. The honest answer is
that it might. The dishonest answer is to say it won't.

The reframe that works is this: a budget makes performance a feature you
ship deliberately, instead of one you lose by accident. The team commits to
a number. The number can change. But the change is explicit, and everyone
sees the trade-off.

In practice, the worst outcome is not "we missed the budget". The worst
outcome is "we didn't have one, the page got slow over a year, and nobody
can point to the change that did it". Budgets prevent that drift by making
each change accountable.

## The number is not the point

The interesting thing about latency budgets is not the number itself. It's
that having one moves the conversation about performance from "is this fast
enough" to "how much of our budget did this cost". The first question is
impossible to answer. The second is a normal engineering question, and
engineering questions are the ones the team is good at.
