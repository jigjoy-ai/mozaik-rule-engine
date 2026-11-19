import { Command } from "./command"

export interface CommandRegistry {
	get(id: string): Command | undefined
	register(id: string, command: Command): void
}
