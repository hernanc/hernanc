---
title: "Infrastructure cost work that actually changes the bill"
description: "Cost optimization isn't about reserved vs on-demand debates. It's about finding the small number of resources that account for most of the spend, and making targeted decisions about them."
pubDate: 2025-03-22
tags: ["aws", "infrastructure", "cost", "devops"]
draft: false
---

When the finance side of the company starts asking about cloud spend, the
usual reflex is to send back a list of "savings opportunities" assembled from
a console screenshot and a vague hope that everything will tighten up. It
almost never moves the bill.

The cost work that actually changes things is unglamorous. It comes down to
two questions:

1. Where does the money actually go?
2. Which of those line items have an option you haven't picked yet?

## Get the breakdown before you have opinions

The first hour of any cost review should not be about EC2 instance types. It
should be a single export, grouped by service and tag, sorted by cost
descending. Most teams discover that 80 percent of their bill comes from
somewhere between three and six line items. The other forty things on the
list are a rounding error.

Once you know which lines matter, you can do real work. Until you know,
every optimization is guessing.

## Targeted moves that tend to pay

A short list of moves I have seen pay off across different teams, roughly in
order of effort:

- Right-size the two or three biggest compute clusters. Most teams overshoot
  by a comfortable margin and never come back to it.
- Move long-lived workloads onto Savings Plans or Reserved Instances. You
  usually know which services have not changed shape in a year. Those are
  the safe candidates.
- Find the data transfer. Cross-AZ traffic and NAT Gateway costs sit silently
  in the bill for years and almost nobody looks at them.
- Set storage lifecycle policies on the buckets that grow forever. S3
  Standard for logs that have not been read in six months is a slow leak.

Each of these requires an afternoon and a small amount of risk tolerance.
None of them require a re-architecture.

## What to leave alone

The most common cost-review mistake is touching things you don't understand
because they look expensive. A clean DynamoDB table at $400 a month is not a
fix-it-now situation. It is probably doing exactly what it was designed to
do, and the alternative is more expensive than the bill.

Cost reviews work the same way as any other engineering review. Spend your
effort where it pays. Resist the urge to optimize line items that are loud
but small.

The goal is not a smaller bill at any cost. It is a bill the team can defend
without flinching when finance asks where the money went.
