import { Alignment, SizeTypes } from "@/types";

// i dont feel like configing tailwind rn
export const defaultColorStyles = {
	"white-background": "bg-white",
	"white-text": "text-white",
	"white-border": "border-white",
	"slate-700-background": "bg-slate-700",
	"slate-700-text": "text-slate-700",
	"slate-700-border": "border-slate-700",
	"green-500-background": "bg-green-500",
	"green-500-text": "text-green-500",
	"green-500-border": "border-green-500",
	"red-500-background": "bg-red-500",
	"red-500-text": "text-red-500",
	"red-500-border": "border-red-500",
	"yellow-500-background": "bg-yellow-500",
	"yellow-500-text": "text-yellow-500",
	"yellow-500-border": "border-yellow-500",
} as const;

export default class UtilsCSS {
	/** @deprecated due to how tailwind works, it doesnt ship unknown string values */
	static appendToTailwindCSS(prefix: string, tailwindCSS: string) {
		const copy = tailwindCSS.split(" ");
		const result = copy.map((item) => `${prefix}:${item}`);
		return result.join(" ");
	}

	static returnStylesFromAlignment(alignment: Alignment) {
		let styles = "";
		styles += "left-0";
		switch (alignment.x) {
			case "left":
				break;
			case "middle":
				styles += "calc(50vw-50%)";
				break;
			case "right":
				styles += "calc(100vw-100%)";
				break;
		}

		styles += "top-0";
		switch (alignment.y) {
			case "top":
				break;
			case "middle":
				styles += "calc(50vh-50%)";
				break;
			case "bottom":
				styles += "calc(100vh-100%)";
				break;
		}

		const resultStyles = `transform[${styles}]`;
		return resultStyles;
	}

	static returnStylesFromSize(size: SizeTypes) {
		switch (size) {
			case "smallest":
				return "w-[2rem] h-[2rem]";
			case "small":
				return "w-[4rem] h-[4rem]";
			case "medium":
				return "w-[8rem] h-[8rem]";
			case "large":
				return "w-[16rem] h-[16rem]";
			case "largest":
				return "w-[24rem] h-[24rem]";
		}
	}

	/** @deprecated tailwindCSS lowkey cringe */
	static getColor<T extends keyof typeof defaultColorStyles>(style: T) {
		return defaultColorStyles[style];
	}
}
