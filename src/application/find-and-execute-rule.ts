import { RuleEvaluator } from "./rule-evaluator"
import { InputResolverRegistry } from "../domain/input-resolver-registry"
import { CommandRegistry } from "../domain/command-registry"
import { PolicyDefinition, PolicyFactory } from "../domain/policy-factory"

export class ApplyPolicyUseCase {
	constructor(
		private readonly ruleEvaluator: RuleEvaluator,
		private readonly inputResolverRegistry: InputResolverRegistry,
		private readonly commandRegistry: CommandRegistry,
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
		const command = this.commandRegistry.get(rule.getCommand())
		if (!command) {
			return undefined
		}
		return await command.invoke(input)
	}
}
