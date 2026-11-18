import { Policy } from "../domain/policy"
import { RuleRegistry } from "../domain/rule-registry"
import { Rule } from "../domain/rule"

export class RuleEngine {
	constructor(private readonly ruleRegistry: RuleRegistry) {}

	/** The rule to act on: of those whose condition holds, the one with the smallest priority. */
	async findMatchingRules(policy: Policy, input: unknown): Promise<Rule | undefined> {
		const satisfiedRules = []

		for (const rule of policy.getRules()) {
			const specification = this.ruleRegistry.get(rule.getCondition())
			if (await specification?.isSatisfiedBy(input)) {
				satisfiedRules.push(rule)
			}
		}

		if (satisfiedRules.length === 0) {
			return undefined
		}

		return satisfiedRules.sort((a, b) => (a.getPriority() ?? 0) - (b.getPriority() ?? 0))[0]
	}
}
