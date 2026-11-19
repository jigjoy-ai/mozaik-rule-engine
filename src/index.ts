import { ApplyPolicyUseCase } from "./application/find-and-execute-rule"
import { RuleEvaluator } from "./application/rule-evaluator"
import { Condition } from "./domain/condition"
import { ConditionRegistry } from "./domain/condition-registry"
import { Command } from "./domain/command"
import { CommandRegistry } from "./domain/command-registry"
import { InputResolver } from "./domain/input-resolver"
import { InputResolverRegistry } from "./domain/input-resolver-registry"
import { PolicyDefinition } from "./domain/policy-factory"
import { RuleDefinition } from "./domain/rule"
import { InMemoryConditionRegistry } from "@infrastructure/inmemory-condition-registry"
import { InMemoryInputResolverRegistry } from "@infrastructure/inmemory-input-resolver-registry"
import { InMemoryCommandRegistry } from "@infrastructure/inmemory-command-registry"

export const inputResolverRegistry: InputResolverRegistry = new InMemoryInputResolverRegistry()
export const conditionRegistry: ConditionRegistry = new InMemoryConditionRegistry()
export const commandRegistry: CommandRegistry = new InMemoryCommandRegistry()

function inputResolver(options: { name: string }) {
	return function <T extends new () => InputResolver<unknown, unknown>>(
		ResolverClass: T,
		_context: ClassDecoratorContext,
	): void {
		inputResolverRegistry.register(options.name, new ResolverClass())
	}
}

function condition(options: { name: string }) {
	return function <T extends new () => Condition<unknown>>(
		ConditionClass: T,
		_context: ClassDecoratorContext,
	): void {
		conditionRegistry.register(options.name, new ConditionClass())
	}
}

function command(options: { name: string }) {
	return function <T extends new () => Command>(CommandClass: T, _context: ClassDecoratorContext): void {
		commandRegistry.register(options.name, new CommandClass())
	}
}

const applyPolicyUseCase = new ApplyPolicyUseCase(
	new RuleEvaluator(conditionRegistry),
	inputResolverRegistry,
	commandRegistry,
)

async function applyPolicy(policy: PolicyDefinition, input: unknown) {
	return await applyPolicyUseCase.execute(policy, input)
}

export {
	inputResolver,
	condition,
	command,
	applyPolicy,
	Condition,
	Command,
	InputResolver,
	PolicyDefinition,
	RuleDefinition,
}
