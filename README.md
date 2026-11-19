# Mozaik Rule Engine

Mozaik is a TypeScript rule engine for choosing what your program executes at runtime. Use decorators to define independent rules. Each rule specifies when it applies, which directive to execute, and its priority. When several rules match the current state, the engine executes the directive from the highest-priority match.

For example, a job scheduler might normally start a queued job. A higher-priority rule defers the job while a worker pool is at capacity. When a worker becomes available, the same job can start the next time the rules are evaluated.

## Why we built it

We built the engine to change how an AI agent behaves while its loop is running. At a breakpoint before a file edit, the default rule lets the agent continue. If another agent has changed the file since it was read, a higher-priority rule pauses the loop. Developers can change that decision by changing the rules, without rewriting the loop.
