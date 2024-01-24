"use client";

import React from "react";
import Modal from "@/app/components/UI/Modal/Modal";
import ModalAuthProvider from "./shards/ModalAuthProvider";

const ModalAuth = () => {
	return (
		<Modal alignment={{ x: "middle", y: "middle" }} listenTo="modalAuth">
			<div className="flex flex-col gap-2 p-4">
				<ModalAuthProvider provider="github" />
				<ModalAuthProvider provider="google" />
			</div>
		</Modal>
	);
};

export default ModalAuth;
