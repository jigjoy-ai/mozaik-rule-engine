# Mozaik Rule Engine

Mozaik is a TypeScript rule engine for choosing what your program executes at runtime. Use decorators to define independent rules. Each rule specifies when it applies, which directive to execute, and its priority. When several rules match the current state, the engine executes the directive from the highest-priority match.

For example, a job scheduler might normally start a queued job. A higher-priority rule defers the job while a worker pool is at capacity. When a worker becomes available, the same job can start the next time the rules are evaluated.

## Usage

Define a condition, an input resolver, and a command with decorators. The decorator `name` is the id you reference from a policy. Import the module that declares these classes before calling `applyPolicy`, so the decorators register them.

A smaller `priority` wins. When two matching rules share a priority, the earlier one in the policy runs. An omitted priority is `0`. If no rule matches, or the named command was never registered, `applyPolicy` returns `undefined`.

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

@inputResolver({ name: "job-command-input" })
class JobCommandInputResolver implements InputResolver<SchedulerState, JobCommandInput> {
	async resolve(state: SchedulerState): Promise<JobCommandInput> {
		return { jobId: state.jobId }
	}
}

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

async function schedule(state: SchedulerState) {
	return applyPolicy(schedulerPolicy, state)
}

const deferred = await schedule({
	jobId: "job-42",
	activeWorkers: 4,
	poolSize: 4,
})
// "defer job-42" — both rules match, and priority 1 beats priority 10

const started = await schedule({
	jobId: "job-42",
	activeWorkers: 1,
	poolSize: 4,
})
// "start job-42" — only job-queued matches
```

These are the standard JavaScript decorators, so leave `experimentalDecorators` off.

## Why we built it

We built the engine to change how an AI agent behaves while its loop is running. At a breakpoint before a file edit, the default rule lets the agent continue. If another agent has changed the file since it was read, a higher-priority rule pauses the loop. Developers can change that decision by changing the rules, without rewriting the loop.
