import { Policy } from "../domain/policy"
import { ConditionRegistry } from "../domain/condition-registry"
import { Rule } from "../domain/rule"

export class RuleEvaluator {
	constructor(private readonly conditionRegistry: ConditionRegistry) {}

	/** The rule to act on: of those whose condition holds, the one with the smallest priority. */
	async findMatchingRule(policy: Policy, input: unknown): Promise<Rule | undefined> {
		const satisfiedRules = []

		for (const rule of policy.getRules()) {
			const condition = this.conditionRegistry.get(rule.getCondition())
			if (await condition?.isSatisfiedBy(input)) {
				satisfiedRules.push(rule)
			}
		}

		if (satisfiedRules.length === 0) {
			return undefined
		}

		return satisfiedRules.sort((a, b) => (a.getPriority() ?? 0) - (b.getPriority() ?? 0))[0]
	}
}
