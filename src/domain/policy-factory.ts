import { Policy } from "./policy"
import { Rule, RuleDefinition } from "./rule"

export type PolicyDefinition = {
	rules: RuleDefinition[]
}

export class PolicyFactory {
	static create(policyDefinition: PolicyDefinition): Policy {
		const rules: Rule[] = []
		for (const ruleDefinition of policyDefinition.rules) {
			const rule: Rule = Rule.create({
				condition: ruleDefinition.condition,
				input: ruleDefinition.input,
				directive: ruleDefinition.directive,
				priority: ruleDefinition.priority,
			})
			rules.push(rule)
		}

		const id = crypto.randomUUID()
		return new Policy(id, rules)
	}
}
