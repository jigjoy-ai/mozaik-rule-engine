export interface Command<TInput = unknown, TOutput = unknown> {
	invoke(input: TInput): Promise<TOutput> | TOutput
}
