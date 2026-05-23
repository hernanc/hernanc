---
title: "What I look for in a multi-environment AWS setup"
description: "After several years building and running multi-environment infrastructure for a SaaS product, the small early decisions that compound the most."
pubDate: 2026-01-17
tags: ["aws", "infrastructure", "devops"]
draft: false
---

Most cloud setups don't fail in dramatic ways. They quietly slow the team
down. A staging environment that doesn't really match production. A change to
a single shared resource that breaks two unrelated services. A credential
rotation that takes a week because nobody is sure which dev tool reads which
secret.

By the time those frictions are obvious, the cost of fixing them is high.
The decisions that prevent them are made early and look unremarkable at the
time.

After a few years of running multi-environment AWS infrastructure for a SaaS
product, here is the short list of decisions I would not skip again.

## Separate accounts, not just separate VPCs

The strongest single boundary AWS gives you is the account boundary.
Production gets its own account. Staging gets its own. Anything you would
rather not accidentally affect from a dev session belongs in a different
account from your day-to-day one.

It is much harder to add account separation later than to start with it. The
work to consolidate to fewer accounts is almost always smaller than the work
to split them.

## Infrastructure as code, but only for things that change together

Every environment should be reproducible from code. That doesn't mean every
resource needs to live in the same module.

A useful split:

- Account-level resources change rarely. IAM identity providers, log archive
  buckets, organizational policies. Put them in their own module, owned by
  the platform team.
- Service-level resources change with the services they back. Task
  definitions, target groups, parameter store entries. Live next to the
  service code, deployed with it.

When the change cadences are different, the modules should be different.

## Match production where it matters

Staging never matches production exactly. The question is what it matches.
The list worth investing in:

1. Same database engine and version. Different sizes are fine.
2. Same network topology, including how services talk to each other.
3. Same deployment pipeline. If you can deploy to staging through a
   different mechanism, eventually you will.

Things you can let differ to save cost: instance sizes, replica counts,
redundancy. Most of staging's value is in catching configuration and
integration mistakes, not load.

## Secrets are infrastructure too

If your secrets distribution depends on someone manually pasting into a
console, that is the next outage in slow motion. Pick a single mechanism
for delivering secrets to running services (Parameter Store, Secrets
Manager, External Secrets; the choice matters less than the discipline),
and write down where each secret lives. Rotations stop being scary once
everyone agrees on one path.

## What this buys you

The reason to do all of this isn't tidiness. It's the size of the change you
can ship on a Friday afternoon without thinking twice. A multi-environment
setup is good when "deploy this to production" is a smaller decision than
what to have for lunch.
