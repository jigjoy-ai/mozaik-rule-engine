export type RuleDefinition = {
	condition: string
	inputResolver: string
	command: string | any
	priority?: number
}

export type RuleRecord = {
	id: string
	condition: string
	inputResolver: string
	command: string | any
	priority?: number
}

export class Rule {
	private id: string
	private condition: string
	private inputResolver: string
	private command: string | any
	private priority?: number

	private constructor(
		id: string,
		condition: string,
		inputResolver: string,
		command: string | any,
		priority?: number,
	) {
		this.id = id
		this.condition = condition
		this.inputResolver = inputResolver
		this.command = command
		this.priority = priority
	}

	getId(): string {
		return this.id
	}

	getCondition(): string {
		return this.condition
	}

	getInput(): string {
		return this.inputResolver
	}

	getCommand(): string | any {
		return this.command
	}

	getPriority(): number | undefined {
		return this.priority
	}

	static create(ruleDefinition: RuleDefinition): Rule {
		return new Rule(
			crypto.randomUUID(),
			ruleDefinition.condition,
			ruleDefinition.inputResolver,
			ruleDefinition.command,
			ruleDefinition.priority,
		)
	}

	static rehydrate(record: RuleRecord): Rule {
		return new Rule(record.id, record.condition, record.inputResolver, record.command, record.priority)
	}
}
