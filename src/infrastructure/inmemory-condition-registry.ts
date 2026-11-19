import { Condition } from "@domain/condition"
import { ConditionRegistry } from "@domain/condition-registry"

export class InMemoryConditionRegistry implements ConditionRegistry {
	private conditions: Map<string, Condition<any>> = new Map()

	register(id: string, condition: Condition<any>): void {
		this.conditions.set(id, condition)
	}

	get(id: string): Condition<any> | undefined {
		return this.conditions.get(id)
	}
}
