"use client";

import GlobalStore from "@/common/global_store";
import { ModalTypes } from "@/types/local";
import React, { useEffect, useState } from "react";

interface ModalProps {
	children: React.ReactNode;
	listenTo: ModalTypes;
}

const Modal = ({ children, listenTo }: ModalProps) => {
	const [isOpened, setIsOpened] = useState(false);

	const listenForOpened = () => {
		const newState = GlobalStore.getFromGlobalStore(listenTo).isOpened;
		setIsOpened(newState);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable(listenTo, listenForOpened);
	});

	return (
		<>
			{isOpened && (
				<div draggable className="z-10 fixed border-4 border-slate-900 p-2 cursor-pointer bg-white">
					{children}
				</div>
			)}
		</>
	);
};

export default Modal;
