export interface Directive<TInput = unknown, TOutput = unknown> {
	invoke(input: TInput): Promise<TOutput> | TOutput
}
