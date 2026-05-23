---
title: "On-call rotations that respect everyone's evenings"
description: "A good rotation is not a test of heroism. It's the result of a system that pages rarely, and pages with enough context to act on."
pubDate: 2025-09-07
tags: ["on-call", "culture", "devops", "reliability"]
draft: false
---

A team's relationship with on-call tells you a lot about the rest of its
engineering. Teams that quietly accept four 3 a.m. pages a week tend to also
accept slow incident response, missing runbooks, and dashboards that nobody
trusts. Teams that fight to reduce on-call load tend to fix the underlying
problems too.

The goal of a healthy rotation is simple. It pages you when something is
genuinely wrong, with enough context that you can act, and it pages you so
rarely that you trust it when it does.

## Treat every page as a question about your alerting

Every page during a quiet week is data. The right meeting to have on Monday
is not "what happened" but "should this page have woken you up". The
categories are usually:

1. Real problem, the page was correct, the runbook worked.
2. Real problem, but it could have waited until business hours.
3. Symptom of a problem upstream, not the right thing to page on.
4. Not a problem, the threshold was wrong.

Categories two through four are most of the pages on most teams. They are
all alerting bugs, and they all have fixes.

## Page on symptoms users see, not internal noise

The most common cause of bad on-call is alerting on machine-level signals
instead of user-level ones. CPU saturated for two minutes is rarely
actionable. Error rate above one percent for two minutes almost always is.

A short list of pages worth keeping, roughly in priority order:

- Customer-facing error rate above a threshold.
- P99 latency above a threshold for a sustained window.
- Saturation of a queue users depend on.
- Health check failing on a primary path.

A lot of teams have twenty pages where these four would do.

## Make the runbook the thing the page links to

A page without a runbook is a page that depends on whoever is on-call having
all the context. That is the exact thing the rotation is trying to avoid.

The runbook does not have to be elegant. It has to answer three questions:
what does this alert mean, what should I check first, and what is the safe
action if I am not sure. Two paragraphs and a couple of links is usually
enough.

## The metric that matters

The single number I care about for a team's on-call health is *pages per
person per week, averaged over a quarter*. If that number is above one, the
team is paying a tax in attention that compounds in every other piece of
work. If it's below one, on-call stops being a burden and starts being what
it is supposed to be: a sensor that catches the things that matter.

Most of the work to get there is just being unwilling to leave bad pages in
place.
