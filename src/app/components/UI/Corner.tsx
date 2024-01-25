import React from "react";
import { SizeTypes } from "@/types";
import { StatusColorTypes } from "@/types";

interface CornerProps {
	color: StatusColorTypes;
	facing: "up-right" | "up-left" | "down-right" | "down-left";
	size: SizeTypes;
}

const Corner = ({ color, facing, size }: CornerProps) => {
	let colorStyles: string;
	let facingStyles: string;
	let sizeStyles: string;

	switch (color) {
		case "red":
			colorStyles = "border-red-600";
			break;
		case "green":
			colorStyles = "border-green-600";
			break;
		case "yellow":
			colorStyles = "border-yellow-600";
			break;
	}

	switch (facing) {
		case "up-right":
			facingStyles = "border-r-slate-700 border-t-slate-700";
			break;
		case "up-left":
			facingStyles = "border-l-slate-700 border-t-slate-700";
			break;
		case "down-right":
			facingStyles = "border-r-slate-700 border-b-slate-700";
			break;
		case "down-left":
			facingStyles = "border-l-slate-700 border-b-slate-700";
			break;
	}

	switch (size) {
		case "largest":
			sizeStyles = "border-[32px]";
			break;
		case "large":
			sizeStyles = "border-[24px]";
			break;
		case "medium":
			sizeStyles = "border-[16px]";
			break;
		case "small":
			sizeStyles = "border-[8px]";
			break;
		case "smallest":
			sizeStyles = "border-[2px]";
			break;
	}

	return <div className={`${colorStyles} ${facingStyles} ${sizeStyles}`}></div>;
};

export default Corner;
