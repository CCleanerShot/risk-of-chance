export default class Utils {
	static firstLetterUppercase(input: string) {
		const firstLetter = input[0].toUpperCase();
		return input.replace(/./, firstLetter);
	}

	static Log(type: "error" | "warn", message: any) {
		let prefix: "?" | "!";
		switch (type) {
			case "error":
				prefix = "!";
				break;
			case "warn":
				prefix = "?";
				break;
		}

		console.log(prefix, message);
	}

	static Random(min: number, max: number) {
		const difference = max - min;
		const result = Math.random() * difference + min;
		return result;
	}

	static MakeArray<T extends any>(length: number, eachNumber: (index: number) => T) {
		return Array(length)
			.fill(null)
			.map((v, i) => eachNumber(i)) as T[];
	}
}
