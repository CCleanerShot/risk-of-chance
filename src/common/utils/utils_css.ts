import { Alignment, SizeTypes } from "@/types";

// i dont feel like configing tailwind rn
export const defaultColorStyles = {
	"white-background": "bg-white",
	"white-text": "text-white",
	"white-border": "border-white",
	"slate-700-background": "bg-slate-700",
	"slate-700-text": "text-slate-700",
	"slate-700-border": "border-slate-700",
	"green-600-background": "bg-green-600",
	"green-600-text": "text-green-600",
	"green-600-border": "border-green-600",
	"red-600-background": "bg-red-600",
	"red-600-text": "text-red-600",
	"red-600-border": "border-red-600",
	"yellow-600-background": "bg-yellow-600",
	"yellow-600-text": "text-yellow-600",
	"yellow-600-border": "border-yellow-600",
} as const;

export default class UtilsCSS {
	/** @deprecated due to how tailwind works, it doesnt ship unknown string values */
	static appendToTailwindCSS(prefix: string, tailwindCSS: string) {
		const copy = tailwindCSS.split(" ");
		const result = copy.map((item) => `${prefix}:${item}`);
		return result.join(" ");
	}

	static returnPositionFromAlignment(alignment: Alignment) {
		let alignmentStyles: { left: 0; top: 0; transform: { x: string; y: string } } = { left: 0, top: 0, transform: { x: "", y: "" } };
		switch (alignment.x) {
			case "left":
				break;
			case "middle":
				alignmentStyles.transform.x = "calc( 50vw - 50% )";
				break;
			case "right":
				alignmentStyles.transform.x = "calc( 100vw - 100% )";
				break;
		}

		switch (alignment.y) {
			case "top":
				break;
			case "middle":
				alignmentStyles.transform.y = "calc( 50vh - 50% )";
				break;
			case "bottom":
				alignmentStyles.transform.y = "calc( 100vh - 100% )";
				break;
		}

		return alignmentStyles;
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
