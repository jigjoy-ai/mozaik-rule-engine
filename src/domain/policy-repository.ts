import { Policy } from "./policy"

export interface PolicyRepository {
	findById(id: string): Promise<Policy | undefined>
	save(policy: Policy): Promise<void>
}
