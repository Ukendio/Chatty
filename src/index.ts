import { TextChatService } from "@rbxts/services";

export type Chatty = typeof Chatty;

export namespace Chatty {
	export function createCommands<T extends { [commandName: string]: (src: TextSource, msg: string) => void }>(
		commands: T,
	): Chatty {
		for (const [commandName, fn] of pairs(commands as unknown as Map<string, Callback>)) {
			const command = new Instance("TextChatCommand");
			command.Parent = TextChatService;

			const aliases = string.split(commandName, "/");
			const prefix = "/";

			command.PrimaryAlias = prefix + aliases[0];

			if (aliases.size() > 1) {
				command.SecondaryAlias = "/" + aliases[1];
			}

			command.Triggered.Connect(fn);
		}

		return Chatty;
	}

	export function addFlair(
		fn: (msg: TextChatMessage) => WritableInstanceProperties<CreatableInstances["TextChatMessageProperties"]>,
	): Chatty {
		TextChatService.OnIncomingMessage = (msg) => {
			const props = new Instance("TextChatMessageProperties");
			const override = fn(msg);
			if (msg.TextSource) {
				for (const [name, val] of pairs(override)) {
					props[name] = val as never;
				}
			}
			return props;
		};

		return Chatty;
	}
}
