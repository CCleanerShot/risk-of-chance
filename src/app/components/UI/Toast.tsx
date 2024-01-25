import React from "react";
import { twMerge } from "tailwind-merge";

interface ToastProps {
	message: string;
	className?: string;
	template: keyof typeof toastStyles;
}

const toastStyles = {
	none: "",
	error: "bg-red-500 ",
	warning: "bg-yellow-500",
	log: "bg-green-500",
};

const Toast = ({ message, className, template }: ToastProps) => {
	return <div className={twMerge("text-white border border-white rounded-md", template, className)}>{message}</div>;
};

export default Toast;
