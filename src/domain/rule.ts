export type CreateRuleParams = {
	condition: string
	input: string
	directive: string | any
	priority?: number
}

export type RuleRecord = {
	id: string
	condition: string
	input: string
	directive: string | any
	priority?: number
}

export class Rule {
	private id: string
	private condition: string
	private input: string
	private directive: string | any
	private priority?: number

	private constructor(id: string, condition: string, input: string, directive: string | any, priority?: number) {
		this.id = id
		this.condition = condition
		this.input = input
		this.directive = directive
		this.priority = priority
	}

	getId(): string {
		return this.id
	}

	getCondition(): string {
		return this.condition
	}

	getInput(): string {
		return this.input
	}

	getDirective(): string | any {
		return this.directive
	}

	getPriority(): number | undefined {
		return this.priority
	}

	static create(params: CreateRuleParams): Rule {
		return new Rule(crypto.randomUUID(), params.condition, params.input, params.directive, params.priority)
	}
}
