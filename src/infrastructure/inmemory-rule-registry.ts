import { ConditionSpecification } from "@domain/condition-specification"
import { RuleRegistry } from "@domain/rule-registry"

export class InMemoryRuleRegistry implements RuleRegistry {
	private specifications: Map<string, ConditionSpecification<any>> = new Map()

	get(id: string): ConditionSpecification<any> | undefined {
		return this.specifications.get(id)
	}

	register(id: string, specification: ConditionSpecification<any>): void {
		this.specifications.set(id, specification)
	}
}
