import React from "react";

interface ContainerProps {
	children: React.ReactNode;
	template: keyof typeof containerStyles;
}

const containerStyles = {
	standard: "flex justify-center items-center p-2",
} as const;

const Container = ({ children, template }: ContainerProps) => {
	return <div className={containerStyles[template]}>{children}</div>;
};

export default Container;
