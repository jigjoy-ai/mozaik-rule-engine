import { CreatePolicyParams, Policy } from "./policy"
import { Rule } from "./rule"

export class PolicyFactory {
	static create(params: CreatePolicyParams): Policy {
		const rules: Rule[] = []
		for (const ruleDefinition of params.rules) {
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
