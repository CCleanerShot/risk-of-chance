import { SizeTypes } from "@/types";
import React from "react";
import { twMerge } from "tailwind-merge";

// i dont feel like forwardReffing so its easy to see my props
interface ButtonProps {
	template: keyof typeof buttonStyles;
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
	onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
	onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
	size?: SizeTypes;
}

const buttonStyles = {
	standard: "border-2 border-slate-900 hover:text-green-600",
	darker_inner: "border-2 border-slate-900 hover:bg-green-600 ",
	borderless: "hover:text-green-600",
	green_border: "border-2 border-slate-900 hover:border-green-600",
} as const;

const Button = ({ template, children, className, disabled = false, onClick, onMouseEnter, onMouseLeave, size }: ButtonProps) => {
	let sizeStyles: string = "";
	switch (size) {
		case "largest":
			sizeStyles = "w-24 h-24";
			break;
		case "large":
			sizeStyles = "w-20 h-20";
			break;
		case "medium":
			sizeStyles = "w-16 h-16";
			break;
		case "small":
			sizeStyles = "w-12 h-12";
			break;
		case "smallest":
			sizeStyles = "w-8 h-8";
			break;
	}

	return (
		<button
			type="button"
			disabled={disabled}
			style={{ pointerEvents: disabled ? "none" : "auto" }}
			className={twMerge(size ? sizeStyles : "", buttonStyles[template], "transition p-2 hover:scale-105 cursor-pointer", className)}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{children}
		</button>
	);
};

export default Button;
