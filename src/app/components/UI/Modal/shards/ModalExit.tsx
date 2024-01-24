import React from "react";
import { ModalTypes } from "@/types";
import { IoMdClose } from "react-icons/io";
import GlobalStore from "@/common/global_store";
import Button from "@/app/components/UI/Button";
import { twMerge } from "tailwind-merge";

interface ModalExitProps {
	modal: ModalTypes;
	className?: string;
}

const ModalExit = ({ modal, className }: ModalExitProps) => {
	const handleClose = () => {
		GlobalStore.UpdateVariableProperty(modal, "isOpened", false);
	};

	return (
		<div className="flex justify-end">
			<Button template="borderless" onClick={handleClose} className={twMerge("hover:bg-green-200 rounded-md", className)}>
				<IoMdClose />
			</Button>
		</div>
	);
};

export default ModalExit;
