# Mozaik Rule Engine

Mozaik is a TypeScript rule engine for choosing what your program executes at runtime. Use decorators to define independent rules. Each rule specifies when it applies, which directive to execute, and its priority. When several rules match the current state, the engine executes the directive from the highest-priority match.

For example, a job scheduler might normally start a queued job. A higher-priority rule defers the job while a worker pool is at capacity. When a worker becomes available, the same job can start the next time the rules are evaluated.

## Usage

The same scheduler, one step at a time. Import the module that declares these classes before calling `applyPolicy`. The decorators register each class under its `name`. They are standard JavaScript decorators, so leave `experimentalDecorators` off.

```ts
import {
	applyPolicy,
	command,
	condition,
	Condition,
	inputResolver,
	type Command,
	type InputResolver,
	type PolicyDefinition,
} from "@jigjoy/mozaik-rule-engine"

type SchedulerState = {
	jobId: string
	activeWorkers: number
	poolSize: number
}

type JobCommandInput = {
	jobId: string
}
```

### Specify a condition

```ts
@condition({ name: "job-queued" })
class JobQueued extends Condition<SchedulerState> {
	isSatisfiedBy(state: SchedulerState): boolean {
		return state.jobId.length > 0
	}
}

@condition({ name: "pool-at-capacity" })
class PoolAtCapacity extends Condition<SchedulerState> {
	isSatisfiedBy(state: SchedulerState): boolean {
		return state.activeWorkers >= state.poolSize
	}
}
```

### Specify an input resolver

The resolver turns the current state into the input a command receives.

```ts
@inputResolver({ name: "job-command-input" })
class JobCommandInputResolver implements InputResolver<SchedulerState, JobCommandInput> {
	async resolve(state: SchedulerState): Promise<JobCommandInput> {
		return { jobId: state.jobId }
	}
}
```

### Specify a command

```ts
@command({ name: "start-job" })
class StartJob implements Command<JobCommandInput, string> {
	invoke(input: JobCommandInput): string {
		return `start ${input.jobId}`
	}
}

@command({ name: "defer-job" })
class DeferJob implements Command<JobCommandInput, string> {
	invoke(input: JobCommandInput): string {
		return `defer ${input.jobId}`
	}
}
```

### Add rules to a policy

A smaller `priority` wins. An omitted priority is `0`. When two matches share a priority, the earlier rule runs.

```ts
const schedulerPolicy: PolicyDefinition = {
	rules: [
		{
			condition: "job-queued",
			inputResolver: "job-command-input",
			command: "start-job",
			priority: 10,
		},
		{
			condition: "pool-at-capacity",
			inputResolver: "job-command-input",
			command: "defer-job",
			priority: 1,
		},
	],
}
```

### Evaluate and execute

`applyPolicy` runs the command from the winning rule. If nothing matches, or that command was never registered, it returns `undefined`.

```ts
const deferred = await applyPolicy(schedulerPolicy, {
	jobId: "job-42",
	activeWorkers: 4,
	poolSize: 4,
})
// "defer job-42" — both rules match, and priority 1 wins

const started = await applyPolicy(schedulerPolicy, {
	jobId: "job-42",
	activeWorkers: 1,
	poolSize: 4,
})
// "start job-42" — only job-queued matches
```

## Why we built it

We built the engine to change how an AI agent behaves while its loop is running. At a breakpoint before a file edit, the default rule lets the agent continue. If another agent has changed the file since it was read, a higher-priority rule pauses the loop. Developers can change that decision by changing the rules, without rewriting the loop.
