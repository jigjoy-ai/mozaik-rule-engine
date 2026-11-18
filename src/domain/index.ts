import { ConditionSpecification } from "./condition-specification"
import { DirectiveRegistry } from "./directive-registry"
import { RuleRegistry } from "./rule-registry"
import { InputResolver } from "./input-resolver"
import { InputResolverRegistry } from "./input-resolver-registry"
import { Directive } from "./directive"

export const inputResolverRegistry = new InputResolverRegistry()

export const specificationRegistry = new RuleRegistry()
export const directiveRegistry = new DirectiveRegistry()

export function Input(options: { name: string }) {
	return function <T extends new () => InputResolver<unknown, unknown>>(
		ResolverClass: T,
		_context: ClassDecoratorContext,
	): void {
		inputResolverRegistry.register(options.name, new ResolverClass())
	}
}

export function Condition(options: { name: string }) {
	return function <T extends new () => ConditionSpecification<unknown>>(
		SpecificationClass: T,
		_context: ClassDecoratorContext,
	): void {
		specificationRegistry.register(options.name, new SpecificationClass())
	}
}

export function Directive(options: { name: string }) {
	return function <T extends new () => Directive>(DirectiveClass: T, _context: ClassDecoratorContext): void {
		directiveRegistry.register(options.name, new DirectiveClass())
	}
}
