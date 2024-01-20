import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
	children: React.ReactNode;
	onClick: (args: any) => any;
	template: keyof typeof buttonStyles;
	className?: string;
}

const buttonStyles = {
	standard: "border-2 p-2 hover:text-green-500 border-slate-900 hover:scale-105 font-bold",
} as const;

const Button = ({ children, onClick, template, className }: ButtonProps) => {
	return (
		<button type="button" className={twMerge(buttonStyles[template], "transition cursor-pointer", className)} onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;
