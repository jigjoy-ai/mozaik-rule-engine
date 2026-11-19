import { RuleEvaluator } from "./rule-evaluator"
import { InputResolverRegistry } from "../domain/input-resolver-registry"
import { DirectiveRegistry } from "../domain/directive-registry"
import { PolicyDefinition, PolicyFactory } from "../domain/policy-factory"

export class ApplyPolicyUseCase {
	constructor(
		private readonly ruleEvaluator: RuleEvaluator,
		private readonly inputResolverRegistry: InputResolverRegistry,
		private readonly directiveRegistry: DirectiveRegistry,
	) {}

	async execute(policyDefinition: PolicyDefinition, state: unknown): Promise<unknown> {
		const policy = PolicyFactory.create(policyDefinition)
		const rule = await this.ruleEvaluator.findMatchingRule(policy, state)
		if (!rule) {
			return undefined
		}

		const inputResolver = this.inputResolverRegistry.get(rule.getInput())
		if (!inputResolver) {
			throw new Error(`Input ${rule.getInput()} not found`)
		}

		const input = await inputResolver.resolve(state)
		const directive = this.directiveRegistry.get(rule.getDirective())
		if (!directive) {
			return undefined
		}
		return await directive.invoke(input)
	}
}
