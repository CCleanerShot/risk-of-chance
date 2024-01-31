"use client";

import React from "react";
import Modal from "@/app/components/UI/Modal/Modal";

const ModalSettings = () => {
	return (
		<Modal alignment={{ x: "middle", y: "middle" }} listenTo="modalSettings">
			<div className="flex flex-col gap-2 p-4">
				<div>Settings</div>
			</div>
		</Modal>
	);
};

export default ModalSettings;
