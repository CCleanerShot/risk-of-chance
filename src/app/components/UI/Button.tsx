import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
	template: keyof typeof buttonStyles;
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
}

const buttonStyles = {
	standard: "border-2 border-slate-900 hover:text-green-600",
	darker_inner: "border-2 border-slate-900 hover:bg-green-600 ",
	borderless: "hover:text-green-600",
	green_border: "border-2 border-slate-900 hover:border-green-600",
} as const;

const Button = ({ template, children, className, disabled = false, onClick }: ButtonProps) => {
	return (
		<button type="button" disabled={disabled} className={twMerge(buttonStyles[template], "p-2 hover:scale-105 transition cursor-pointer", className)} onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;
