import { RuleEngine } from "./rule-engine"
import { InputResolverRegistry } from "../domain/input-resolver-registry"
import { DirectiveRegistry } from "../domain/directive-registry"
import { Policy } from "../domain/policy"

export class ReactToMessageUseCase {
	constructor(
		private readonly ruleEngine: RuleEngine,
		private readonly inputResolverRegistry: InputResolverRegistry,
		private readonly directiveRegistry: DirectiveRegistry,
	) {}

	async execute(policy: Policy, state: unknown): Promise<unknown> {
		const rule = await this.ruleEngine.findMatchingRule(policy, state)
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
