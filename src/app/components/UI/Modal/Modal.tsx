"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import { Alignment, ModalTypes } from "@/types/local";
import ModalOverlay from "./shards/ModalOverlay";
import ModalExit from "./shards/ModalExit";
import Movable from "../Movable";

interface ModalProps {
	alignment: Alignment;
	children: React.ReactNode;
	listenTo: ModalTypes;
}

const Modal = ({ alignment, children, listenTo }: ModalProps) => {
	const [isOpened, setIsOpened] = useState(false);

	const listenForOpened = () => {
		const newState = GlobalStore.getFromStore(listenTo).isOpened;
		setIsOpened(newState);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable(listenTo, listenForOpened);
	});

	return (
		<>
			{isOpened && (
				<ModalOverlay>
					<Movable defaultPosition={alignment} className="min-h-40 min-w-80 z-50 fixed border-4 border-slate-900 p-2 cursor-pointer bg-white">
						<ModalExit modal={listenTo} />
						{children}
					</Movable>
				</ModalOverlay>
			)}
		</>
	);
};

Modal.Overlay = ModalOverlay;

export default Modal;
