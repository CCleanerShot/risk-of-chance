import React from "react";
import { twMerge } from "tailwind-merge";

interface H2Props {
	children: React.ReactNode;
	className?: string;
}

const H2 = ({ children, className }: H2Props) => {
	return <h2 className={twMerge("font-bold underline text-lg text-center p-1", className)}>{children}</h2>;
};

export default H2;
