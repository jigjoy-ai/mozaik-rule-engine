import { Condition } from "./condition"

export interface ConditionRegistry {
	get(id: string): Condition<any> | undefined
	register(id: string, condition: Condition<any>): void
}
