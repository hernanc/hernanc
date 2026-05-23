---
title: "Notes on owning a system you didn't design"
description: "What to do in the first month after taking over a service someone else built. The mistake is starting with a rewrite; the better play is to understand the system as an artifact first."
pubDate: 2025-01-11
tags: ["systems", "engineering", "ownership"]
draft: false
---

Every senior engineer ends up in this spot eventually. Someone leaves, a team
reorganizes, or a feature comes back into your plate, and you find yourself
responsible for a service you didn't write and don't fully understand. The
temptation, especially if you've been doing this for a while, is to read the
code, decide it's not how you would have done it, and start drafting a
redesign in your head.

That instinct is almost always wrong.

## Start by treating it as a thing that works

Whatever its faults, the system you just inherited is solving a real problem
for real users right now. That fact is more important than any aesthetic
objection you have to the code. Before you change anything substantial, you
need a working mental model of why the current design exists.

I spend the first two weeks doing one thing: reading. Not to judge, but to
inventory. Where data comes in. Where it goes. Which dependencies are
critical. Which configuration values are silently load-bearing. What each
environment variable actually does.

A good way to force that understanding is to write the runbook the previous
owner didn't.

## Find the load-bearing assumptions

Every long-lived system has a few decisions that look small in code but hold
up everything around them. A particular column with a comment that says
"DO NOT INDEX". A retry counter set to three because some downstream API has
a rate limit nobody documented. A cron job that runs at 04:17 because 04:00
collided with a database snapshot four years ago.

These are the things that bite you if you change them without knowing they
were decisions.

```bash
# A grep I run on day one in any new repo
grep -rEn 'TODO|HACK|FIXME|XXX|NOTE' --include='*.py' --include='*.ts'
```

The comments don't tell you everything. They point you at the load-bearing
assumptions faster than anything else.

## Earn the right to refactor

Once you have a working model, you can change things. But the order matters:
tests first, then small improvements that pay for themselves, then the larger
reshape. Trying to skip the first two and go straight to the redesign is how
teams end up with two half-finished versions of the same system.

The boring truth of taking over an unfamiliar service is that the first month
is about reading and writing tests rather than architecture work. The
architecture work gets cheaper once the system is mapped. Trying to do it
before that is just guessing in a more expensive form.
