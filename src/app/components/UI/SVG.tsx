import { SizeTypes } from "@/types";
import React from "react";
import { twMerge } from "tailwind-merge";

interface IconProps {
	size: SizeTypes;
	url: string;
	className?: string;
	styles?: React.CSSProperties;
}
const SVG = ({ size, url, className, styles }: IconProps) => {
	const maskImage = `url(${url})`;

	let sizeStyles;
	switch (size) {
		case "largest":
			sizeStyles = "h-32 w-32";
			break;
		case "large":
			sizeStyles = "h-24 w-24";
			break;
		case "medium":
			sizeStyles = "h-16 w-16";
			break;
		case "small":
			sizeStyles = "h-8 w-8";
			break;
		case "smallest":
			sizeStyles = "h-4 w-4";
			break;
	}

	const defaultStyles: React.CSSProperties = {
		maskImage: maskImage,
		WebkitMaskImage: maskImage,
		maskSize: "100%",
		maskRepeat: "no-repeat",
		WebkitMaskRepeat: "no-repeat",
	};

	if (styles) {
		Object.assign(defaultStyles, styles);
	}

	return <div className={twMerge("bg-black", sizeStyles, className)} style={defaultStyles} />;
};

export default SVG;
