import { Command } from "@domain/command"
import { CommandRegistry } from "@domain/command-registry"

export class InMemoryCommandRegistry implements CommandRegistry {
	private commands: Map<string, Command> = new Map()

	register(contractId: string, command: Command): void {
		this.commands.set(contractId, command)
	}

	get(contractId: string): Command | undefined {
		const command = this.commands.get(contractId)
		return command
	}
}
