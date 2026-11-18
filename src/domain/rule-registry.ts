import { ConditionSpecification } from "./condition-specification"

export class RuleRegistry {
	private specifications: Map<string, ConditionSpecification<any>> = new Map()

	get(id: string): ConditionSpecification<any> | undefined {
		return this.specifications.get(id)
	}

	register(id: string, specification: ConditionSpecification<any>): void {
		this.specifications.set(id, specification)
	}
}
