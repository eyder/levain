import * as path from "https://deno.land/std/path/mod.ts";

export var homedir = function(): string {
    // Common option
    let home = Deno.env.get("home");
    if (home) {
        return home;
    }

    // Not found - Windows?
    let userprofile = Deno.env.get("userprofile");
    if (userprofile) {
        return userprofile;
    }

    let homedrive = Deno.env.get("homedrive");
    let homepath = Deno.env.get("homepath");
    if (homedrive && homepath) {
        return path.resolve(homedrive, homepath);
    }

    // What else?
    throw "No home for levain. Do you have a refrigerator?";
}

// https://github.com/caspervonb/deno-prompts/blob/master/mod.ts
export async function promptSecret(message : string) : Promise<string | null> {
	Deno.stdout.write(new TextEncoder().encode(message));
	Deno.setRaw(0, true);

	let input = "";
	while (true) {
		const data = new Uint8Array(1);
		const nread = await Deno.stdin.read(data);
		if (!nread) {
			break;
		}

		const string = new TextDecoder().decode(data.slice(0, nread));

		for (const char of string) {
			switch (char) {
				case "\u0003":
				case "\u0004":
					Deno.setRaw(Deno.stdin.rid, false);
					return null;

				case "\r":
				case "\n":
					Deno.setRaw(Deno.stdin.rid, false);
					return input;

				case "\u0008":
					input = input.slice(0, input.length - 1);
					break;

				default:
					input += char;
					break;
			}
		}
	}

	return null;
}
