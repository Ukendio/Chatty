export namespace Chatty {
	export function createCommands<T extends { [commandName: string]: (src: TextSource, msg: string) => void }>(
		commands: T,
	): void {
		for (const [commandName, fn] of pairs(commands) as unknown as Map<string, Callback>) {
			const command = new Instance("TextChatCommand");

			const aliases = string.split(commandName, "/");
			const prefix = "/";

			command.PrimaryAlias = prefix + aliases[0];

			if (aliases.size() > 1) {
				command.SecondaryAlias = prefix + aliases[1];
			}

			command.Triggered.Connect(fn);
		}
	}
}