import React from "react";
import { twMerge } from "tailwind-merge";

interface H1Props {
	children: React.ReactNode;
	className?: string;
}

const H1 = ({ children, className }: H1Props) => {
	return <h1 className={twMerge("font-bold underline text-lg text-center p-2", className)}>{children}</h1>;
};

export default H1;
