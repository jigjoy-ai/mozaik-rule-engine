import { CreateRuleParams, Rule } from "./rule"

export type CreatePolicyParams = {
	rules: CreateRuleParams[]
}

export class Policy {
	private id: string
	private rules: Rule[]

	constructor(id: string, rules: Rule[]) {
		this.id = id
		this.rules = rules
	}

	addRule(rule: Rule): void {
		this.rules.push(rule)
	}

	removeRule(rule: Rule): void {
		this.rules = this.rules.filter((r) => r.getId() !== rule.getId())
	}

	getId(): string {
		return this.id
	}

	getRules(): readonly Rule[] {
		return this.rules
	}
}
