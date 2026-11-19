import { ConditionSpecification } from "./condition-specification"

export interface RuleRegistry {
	get(id: string): ConditionSpecification<any> | undefined
	register(id: string, specification: ConditionSpecification<any>): void
}
