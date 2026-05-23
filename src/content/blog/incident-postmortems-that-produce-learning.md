---
title: "What a good incident postmortem looks like"
description: "Postmortems that produce real learning versus postmortems that produce defensive paperwork. A practical shape that has worked across teams."
pubDate: 2026-02-14
tags: ["incidents", "culture", "engineering", "reliability"]
draft: false
---

The first incident postmortem I ever sat in on was structured around finding
someone to blame. By the end of the hour I knew exactly who had pushed the
change, but no one in the room had any clearer idea of why the system had
failed or how to prevent the next one. The document we produced was useful
only as evidence that the meeting had occurred.

Postmortems do not have to be like that. The shape that consistently
produces learning, in my experience, is almost mechanical. It does not
depend on having a particularly good writer in the room.

## Structure that survives contact with real incidents

The template I keep reaching for has the same six sections every time:

1. **What happened**, written in plain language, including the user-visible
   impact.
2. **Timeline**, in UTC, every relevant event with the source for it.
3. **Contributing factors**, plural, not a single root cause.
4. **What went well**, because the response usually had real wins, and
   naming them is how they get repeated.
5. **What we got lucky with**, the parts that could have made this much
   worse but didn't.
6. **Action items**, each with an owner, a deadline, and a definition of
   done.

The order matters. Putting "contributing factors" before "action items" is
what prevents a postmortem from turning into a sprint planning meeting in
disguise.

## The phrase "root cause" is a trap

Real incidents almost never have a single cause. They have a chain of
decisions, each reasonable in isolation, that lined up wrong. The deploy
was risky, the alerting was too quiet, the runbook was stale, the on-call
had been paged three times that night. Calling any one of those "the root
cause" hides the other three.

Writing "contributing factors" instead is a small change in vocabulary that
does a lot of work. It invites a fuller account. It also makes the action
items better, because each factor suggests something concrete to change.

## The action item discipline

The single biggest difference between postmortems that improve a system and
postmortems that pile up in a wiki is whether the action items get done.

A useful filter, before you leave the meeting:

- Does this item have a named owner?
- Does it have a date?
- Would a reasonable person be able to tell whether it was finished?

Items that fail any of those three are not action items. They are good
intentions. Either fix them in the room or drop them.

## What postmortems are for

A good postmortem is not a document of regret. It is a learning artifact
that compounds. The team gets a little sharper after each one. The system
gets a little less surprising. Over a year, that quiet accumulation is the
most reliable source of reliability work I have found, and it costs less
than any tooling investment.

The trick is that you have to mean it. A postmortem that exists to produce
a clean writeup will produce one, and nothing else.
