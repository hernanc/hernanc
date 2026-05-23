---
title: "Migrating ECS services without a maintenance window"
description: "Concrete notes on how to move an ECS service to new task definitions, new load balancer config, or a new cluster without scheduling downtime."
pubDate: 2025-07-19
tags: ["aws", "ecs", "devops", "deployment"]
draft: false
---

A surprising amount of infrastructure work is migration work. New task
definition, new container, new networking, new cluster. The temptation,
especially for the riskier moves, is to put a maintenance window on the
calendar and do it on a Saturday. With ECS in particular, that window is
almost never necessary, and skipping it tends to produce a calmer migration
than scheduling it.

This is the playbook I keep coming back to.

## Decide what the rollback looks like before you start

Every ECS migration step needs an answer to one question: if this looks wrong
in five minutes, how do I undo it without paging anyone? If you can't answer
it, the step is not ready.

In practice that means the previous task definition revision still exists,
the previous target group is still attached, and the previous deployment is
still recorded in `aws ecs describe-services`. ECS is built around immutable
revisions for exactly this reason. Use them.

## Use deployment circuit breakers and let ECS roll for you

Most of the time, the migration is just a new task definition with the change
in it. The deployment configuration is the part people skip.

```hcl
deployment_configuration {
  minimum_healthy_percent = 100
  maximum_percent         = 200
  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }
}
```

With that in place, a bad image, a bad config, or a container that fails its
health check rolls itself back automatically. You watch the deployment, you
don't drive it.

## When the change is structural, run two services side by side

For the larger moves, where the new task definition is too different to roll
in place, the right shape is usually two services on the same target group,
weighted by the load balancer.

The steps look like this:

1. Stand up the new service with desired count zero, on the new task
   definition.
2. Attach it to the existing target group with a low weight.
3. Bring its desired count up to match capacity.
4. Shift weight on the load balancer in steps, watching the metrics you care
   about between each step.
5. Once the new service is at full weight and healthy, scale the old one to
   zero, then delete.

At every step, the rollback is the same: shift the weight back. That is the
entire safety property.

## What to watch

The metrics that actually matter during a migration are not CPU and memory.
They are the ones tied to user-visible behavior: P99 latency on the routes
the service serves, error rate from the load balancer, and queue depth on
any work the service consumes.

If those three numbers are flat across the migration, the maintenance window
was never needed.
