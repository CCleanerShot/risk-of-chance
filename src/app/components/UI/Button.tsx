import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
	onClick: (args: any) => any;
	template: keyof typeof buttonStyles;
	children?: React.ReactNode;
	className?: string;
}

const buttonStyles = {
	standard: "border-2 border-slate-900 hover:text-green-500",
	darker_inner: "border-2 border-slate-900 hover:text-green-500 hover:bg-green-900 ",
	borderless: "hover:text-green-500",
	green_border: "border-2 border-slate-900 hover:border-green-500",
} as const;

const Button = ({ onClick, template, children, className }: ButtonProps) => {
	return (
		<button type="button" className={twMerge(buttonStyles[template], "p-2 font-bold hover:scale-105 transition cursor-pointer", className)} onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;
