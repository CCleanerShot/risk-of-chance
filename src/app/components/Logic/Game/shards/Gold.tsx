import React from "react";
import { TbCoinFilled } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

interface GoldProps {
	children: React.ReactNode;
	className?: string;
	classNameText?: string;
}

const Gold = ({ children, className, classNameText }: GoldProps) => {
	return (
		<div className={twMerge("flex justify-start items-center gap-1", className)}>
			<TbCoinFilled color="gold" />
			<div className={twMerge("font-bold", classNameText)}>{children}</div>
		</div>
	);
};

export default Gold;
