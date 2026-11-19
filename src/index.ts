import { ApplyPolicyUseCase } from "./application/find-and-execute-rule"
import { RuleEvaluator } from "./application/rule-evaluator"
import { ConditionSpecification } from "./domain/condition-specification"
import { Command } from "./domain/command"
import { CommandRegistry } from "./domain/command-registry"
import { InputResolver } from "./domain/input-resolver"
import { InputResolverRegistry } from "./domain/input-resolver-registry"
import { PolicyDefinition } from "./domain/policy-factory"
import { RuleDefinition } from "./domain/rule"
import { RuleRegistry } from "./domain/rule-registry"
import { InMemoryRuleRegistry } from "@infrastructure/inmemory-rule-registry"
import { InMemoryInputResolverRegistry } from "@infrastructure/inmemory-input-resolver-registry"
import { InMemoryCommandRegistry } from "@infrastructure/inmemory-command-registry"

export const inputResolverRegistry: InputResolverRegistry = new InMemoryInputResolverRegistry()
export const inMemoryRuleRegistry: RuleRegistry = new InMemoryRuleRegistry()
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
	return function <T extends new () => ConditionSpecification<unknown>>(
		SpecificationClass: T,
		_context: ClassDecoratorContext,
	): void {
		inMemoryRuleRegistry.register(options.name, new SpecificationClass())
	}
}

function command(options: { name: string }) {
	return function <T extends new () => Command>(CommandClass: T, _context: ClassDecoratorContext): void {
		commandRegistry.register(options.name, new CommandClass())
	}
}

const applyPolicyUseCase = new ApplyPolicyUseCase(
	new RuleEvaluator(inMemoryRuleRegistry),
	inputResolverRegistry,
	commandRegistry,
)

async function applyPolicy(policy: PolicyDefinition, input: unknown) {
	return await applyPolicyUseCase.execute(policy, input)
}

export { inputResolver, condition, command, applyPolicy, PolicyDefinition, RuleDefinition }
