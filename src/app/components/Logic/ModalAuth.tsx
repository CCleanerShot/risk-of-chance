"use client";

import React, { useEffect, useState } from "react";
import Movable from "../UI/Movable";
import Modal from "../UI/Modal";
import { ModalAuthTabTypes } from "@/types";
import GlobalStore from "@/common/global_store";

const ModalAuth = () => {
	const [tab, setTab] = useState<ModalAuthTabTypes>(GlobalStore.getFromGlobalStore("modalAuth").tab);

	const listenToTab = () => {
		const newTab = GlobalStore.getFromGlobalStore("modalAuth").tab;
		setTab(newTab);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("modalAuth", listenToTab);
	}, []);

	const Tab = () => {
		switch (tab) {
			case "register":
				return <div>register</div>;
			case "signin":
				return <div>signin</div>;
		}
	};

	return (
		<Movable defaultPosition={{ x: "middle", y: "middle" }}>
			<Modal listenTo="modalAuth">
				<Tab />
			</Modal>
		</Movable>
	);
};

export default ModalAuth;
