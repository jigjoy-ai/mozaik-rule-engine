import { ApplyPolicyUseCase } from "./application/find-and-execute-rule"
import { RuleEvaluator } from "./application/rule-evaluator"
import { ConditionSpecification } from "./domain/condition-specification"
import { Directive } from "./domain/directive"
import { DirectiveRegistry } from "./domain/directive-registry"
import { InputResolver } from "./domain/input-resolver"
import { InputResolverRegistry } from "./domain/input-resolver-registry"
import { PolicyDefinition } from "./domain/policy-factory"
import { RuleDefinition } from "./domain/rule"
import { RuleRegistry } from "./domain/rule-registry"

export const inputResolverRegistry = new InputResolverRegistry()

export const specificationRegistry = new RuleRegistry()
export const directiveRegistry = new DirectiveRegistry()

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
		specificationRegistry.register(options.name, new SpecificationClass())
	}
}

function directive(options: { name: string }) {
	return function <T extends new () => Directive>(DirectiveClass: T, _context: ClassDecoratorContext): void {
		directiveRegistry.register(options.name, new DirectiveClass())
	}
}

const applyPolicyUseCase = new ApplyPolicyUseCase(
	new RuleEvaluator(new RuleRegistry()),
	new InputResolverRegistry(),
	new DirectiveRegistry(),
)

async function applyPolicy(policy: PolicyDefinition, input: unknown) {
	return await applyPolicyUseCase.execute(policy, input)
}

export { inputResolver, condition, directive, applyPolicy, PolicyDefinition, RuleDefinition }
