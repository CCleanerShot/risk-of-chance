export default class Utils {
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

	/** helper function that returns a random number from a given min/max range */
	static Random(min: number, max: number) {
		const difference = max - min;
		const result = Math.random() * difference + min;
		return result;
	}

	/** helper function to create a null array */
	static MakeNullArray(length: number) {
		return Array(length).fill(null);
	}

	/** helper function to create a null array, which then each element is iterated on */
	static MakeArray<T extends any>(length: number, eachNumber: (index: number) => T) {
		return Array(length)
			.fill(null)
			.map((v, i) => eachNumber(i)) as T[];
	}

	/** helper function which returns a copy of the array, shuffled */
	static ShuffleArray<T extends any[]>(array: T) {
		const newArray = [...array];

		for (let i = 0; i < newArray.length; i++) {
			const r = Math.floor(Math.random() * newArray.length);

			[newArray[i], newArray[r]] = [newArray[r], newArray[i]];
		}

		return newArray;
	}

	/** helper function which formats a number like so: 10 000 000 */
	static FormatNumber(input: number) {
		const reversed = Utils.ReverseString(input.toString());
		const result = reversed.match(/.{1,3}/g)!.join(" ");
		return Utils.ReverseString(result);
	}

	/** helper function that reverses a string */
	static ReverseString(input: string) {
		let result: string = "";
		for (let i = input.length - 1; i >= 0; i--) {
			result += input[i];
		}

		return result;
	}

	/** helper function that just uppercases the first letter */
	static FirstLetterUppercase(input: string) {
		const firstLetter = input[0].toUpperCase();
		return input.replace(/./, firstLetter);
	}
}
