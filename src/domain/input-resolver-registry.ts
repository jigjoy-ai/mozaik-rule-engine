import { InputResolver } from "./input-resolver"

export interface InputResolverRegistry {
	get(id: string): InputResolver<any, any>
	register(id: string, resolver: InputResolver<any, any>): void
}
