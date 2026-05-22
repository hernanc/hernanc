---
title: "Code Review Is a Design Tool"
description: "The best reviews don't catch typos — they catch the wrong abstraction before it sets. Treat review as design feedback, and it changes what you ask for."
pubDate: 2026-05-18
tags: ["engineering", "culture", "code-review"]
draft: false
---

Most teams treat code review as a checkpoint: a gate where someone confirms the
code compiles, the tests pass, and the style is consistent. That's a fine
floor. It's a poor ceiling.

The reviews that change how a codebase ages are the ones that engage with
*design* — the shape of the abstraction, the names, the boundaries — while
those are still cheap to change.

## Feedback gets more expensive over time

A comment on a design sketch costs an afternoon. The same comment on a merged,
deployed system costs a migration.

![Cost of acting on feedback rises sharply from design sketch to pull request to production.](../../assets/posts/code-review-as-design/review-feedback.svg)

This is the case for reviewing *intent* early — a short design note, a draft
PR, a diagram — rather than waiting for a thousand-line change that is, by the
time it arrives, emotionally and practically hard to unwind.

## Review the diff you can't see

The valuable review question is rarely "is this line correct?" It's "is this
the right thing to build?" A few prompts that consistently surface that:

```text
- What did this change make harder to do next?
- Which name will a new engineer misread six months from now?
- What's the smallest version of this that would still be worth shipping?
- If this breaks at 3 a.m., what will the on-call engineer wish existed?
```

None of these are about the lines on screen. They're about the lines that
*aren't* there — the abstraction the author chose, and the three they didn't.

## Make it safe to be early

You only get design-level feedback if people share work before it's polished.
That requires a culture where a draft is welcomed, not judged — where "I'm not
sure about this shape yet" is a normal thing to say in a pull request.

Review is one of the few moments where the whole team thinks about the same
problem at once. Spend it on the questions that are expensive to get wrong.

---

*This is a sample post — placeholder content for the new blog. Replace it, or
publish a real article straight from a GitHub issue.*
