"use client";

import React from "react";
import Modal from "@/app/components/UI/Modal/Modal";
import ModalAuthProvider from "./shards/ModalAuthProvider";
import H1 from "../../UI/H1";

const ModalAuth = () => {
	return (
		<Modal alignment={{ x: "middle", y: "middle" }} listenTo="modalAuth" className="min-h-30 min-w-40">
			<H1>Join with any of the following</H1>
			<div className="flex flex-col gap-2 p-4">
				<ModalAuthProvider provider="github" />
				<ModalAuthProvider provider="google" />
			</div>
		</Modal>
	);
};

export default ModalAuth;
