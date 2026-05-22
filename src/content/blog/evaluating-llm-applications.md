---
title: "A Practical Checklist for Evaluating LLM Applications"
description: "Shipping an AI feature without evaluation is shipping a vibe. Here's a concrete loop for turning that vibe into something you can measure and improve."
pubDate: 2026-05-03
tags: ["ai", "llm", "evaluation"]
draft: false
---

The hardest part of building with large language models isn't getting a demo
to work — it's knowing whether your change made things *better*. Without
evaluation, every prompt tweak is a guess, and every release is a leap of
faith.

The fix is not exotic. It's the same discipline we apply everywhere else in
engineering: define what "good" means, measure it, and close the loop.

## Start with a dataset, not a prompt

Before touching the prompt, collect twenty to fifty real examples of the task.
Real inputs, with the outputs you'd consider correct. This is your eval set,
and it's the single highest-leverage artifact in the whole project.

![An evaluation loop: dataset, run the system, score and grade, change one thing, repeat.](../../assets/posts/evaluating-llm-applications/eval-loop.svg)

A small, honest dataset beats a large, aspirational one. You will look at these
examples more than any other code you write.

## Grade with something repeatable

Eyeballing outputs doesn't scale and doesn't survive a refactor. Wrap the
judgement in code — even a rough rubric is better than a feeling.

```python
def grade(example, output) -> float:
    score = 0.0
    if example.must_mention in output:
        score += 0.5                      # did it cover the key fact?
    if not contains_hallucinated_url(output):
        score += 0.3                      # did it stay grounded?
    if len(output) <= example.max_length:
        score += 0.2                      # did it respect the format?
    return score
```

Some checks are deterministic. Others — tone, faithfulness, helpfulness — are
better judged by a model. Both are fine. What matters is that the grade is
*reproducible*: run it twice, get the same answer.

## Change one thing at a time

With a dataset and a grader, you finally have a loop. Run the eval, record the
score, change exactly one thing, run it again. If the score moved, you learned
something. If it didn't, you also learned something.

That's the whole game: replace guessing with a number you trust.

---

*This is a sample post — placeholder content for the new blog. Replace it, or
publish a real article straight from a GitHub issue.*
