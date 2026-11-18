export abstract class ConditionSpecification<TState> {
	abstract isSatisfiedBy(state: TState): Promise<boolean> | boolean

	and(other: ConditionSpecification<TState>): ConditionSpecification<TState> {
		return new AndConditionSpecification(this, other)
	}

	or(other: ConditionSpecification<TState>): ConditionSpecification<TState> {
		return new OrConditionSpecification(this, other)
	}

	not(): ConditionSpecification<TState> {
		return new NotConditionSpecification(this)
	}
}

export class AndConditionSpecification<TState> extends ConditionSpecification<TState> {
	constructor(
		private readonly left: ConditionSpecification<TState>,
		private readonly right: ConditionSpecification<TState>,
	) {
		super()
	}

	async isSatisfiedBy(state: TState): Promise<boolean> {
		return (await this.left.isSatisfiedBy(state)) && (await this.right.isSatisfiedBy(state))
	}
}

export class OrConditionSpecification<TState> extends ConditionSpecification<TState> {
	constructor(
		private readonly left: ConditionSpecification<TState>,
		private readonly right: ConditionSpecification<TState>,
	) {
		super()
	}

	async isSatisfiedBy(state: TState): Promise<boolean> {
		return (await this.left.isSatisfiedBy(state)) || (await this.right.isSatisfiedBy(state))
	}
}

export class NotConditionSpecification<TState> extends ConditionSpecification<TState> {
	constructor(private readonly condition: ConditionSpecification<TState>) {
		super()
	}

	async isSatisfiedBy(state: TState): Promise<boolean> {
		return !(await this.condition.isSatisfiedBy(state))
	}
}
