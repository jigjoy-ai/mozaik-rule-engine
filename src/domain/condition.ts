export abstract class Condition<TState> {
	abstract isSatisfiedBy(state: TState): Promise<boolean> | boolean

	and(other: Condition<TState>): Condition<TState> {
		return new AndCondition(this, other)
	}

	or(other: Condition<TState>): Condition<TState> {
		return new OrCondition(this, other)
	}

	not(): Condition<TState> {
		return new NotCondition(this)
	}
}

export class AndCondition<TState> extends Condition<TState> {
	constructor(
		private readonly left: Condition<TState>,
		private readonly right: Condition<TState>,
	) {
		super()
	}

	async isSatisfiedBy(state: TState): Promise<boolean> {
		return (await this.left.isSatisfiedBy(state)) && (await this.right.isSatisfiedBy(state))
	}
}

export class OrCondition<TState> extends Condition<TState> {
	constructor(
		private readonly left: Condition<TState>,
		private readonly right: Condition<TState>,
	) {
		super()
	}

	async isSatisfiedBy(state: TState): Promise<boolean> {
		return (await this.left.isSatisfiedBy(state)) || (await this.right.isSatisfiedBy(state))
	}
}

export class NotCondition<TState> extends Condition<TState> {
	constructor(private readonly condition: Condition<TState>) {
		super()
	}

	async isSatisfiedBy(state: TState): Promise<boolean> {
		return !(await this.condition.isSatisfiedBy(state))
	}
}
