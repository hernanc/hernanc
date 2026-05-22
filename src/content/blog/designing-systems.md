---
title: "Designing Systems That Survive Contact With Production"
description: "Reliability comes from decisions made early in a design, and most of those decisions are about what happens when something goes wrong."
pubDate: 2025-11-30
tags: ["systems", "reliability", "engineering"]
draft: false
---

Every system works on the happy path. What separates a prototype from
production code is how it behaves when reality stops cooperating. A dependency
gets slow. A deploy goes out half finished. Traffic spikes to three times your
last capacity test.

No system avoids failure forever. The ones that last fail in small ways you can
predict and recover from.

## Make failure a first-class case

A common mistake is to treat errors as an afterthought, a `catch` block added
once the feature works. It pays off to sketch the failure modes before you
write the happy path.

![A request travels through a gateway and a service to a datastore; a timeout triggers a bounded retry.](../../assets/posts/designing-systems/request-path.svg)

For every dependency, work through a few questions. What happens if it gets
slow? What happens if it goes down? What happens if it returns something wrong
but plausible? Each answer is a design decision. If you don't make it on
purpose, the system makes it for you.

## Bound everything

A lot of production incidents come down to work that was never bounded. A retry
with no limit turns into a retry storm. A queue with no ceiling runs the
process out of memory. A request with no deadline leaks the thread waiting on
it.

```ts
async function callDependency<T>(fn: () => Promise<T>): Promise<T> {
  const deadline = AbortSignal.timeout(2_000);
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (++attempt >= 3 || deadline.aborted) throw err;
      // Exponential backoff with jitter, so this never becomes a tight loop.
      await sleep(2 ** attempt * 100 + Math.random() * 100);
    }
  }
}
```

The specific numbers matter less than the habit behind them: give every loop an
exit, every wait a ceiling, and every blocking call a deadline.

## Design for the operator

Six months from now, someone will be looking at this system at 3 a.m., and it
might be you. That person will not have the context you have while writing the
code today. The logs, metrics, and error messages you add now are the only
notes they get.

A good system tells you why it is unhealthy, not just that something is wrong.
That kind of observability is far cheaper to build in while you design than to
bolt on afterwards.

---

*This is a sample post with placeholder content. Replace it, or publish a real
article straight from a GitHub issue.*
