"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/app/components/UI/Modal/Modal";
import GlobalStore from "@/common/global_store";
import H1 from "../../UI/H1";
import Keybind from "./shards/Keybind";
import { SettingTypes } from "@/types";

const ModalSettings = () => {
	const [settings, setSettings] = useState(GlobalStore.getFromStore("settings").settings);
	const [settingToChange, setSettingToChange] = useState(GlobalStore.getFromStore("settingToChange").settingToChange);

	const listenToSettings = () => {
		const newSettings = GlobalStore.getFromStore("settings").settings;
		setSettings(newSettings);
	};

	const listenToSettingToChange = () => {
		const newSettingToChange = GlobalStore.getFromStore("settingToChange").settingToChange;
		setSettingToChange(newSettingToChange);
	};

	useEffect(() => {
		GlobalStore.AddListener("settings", listenToSettings);
		GlobalStore.AddListener("settingToChange", listenToSettingToChange);

		listenToSettings();
		listenToSettingToChange();
	}, []);

	return (
		<Modal alignment={{ x: "middle", y: "middle" }} listenTo="modalSettings">
			<div className="flex flex-col gap-2 p-2">
				<H1>Settings</H1>
				{Object.entries(settings).map(([key, value], index) => (
					<Keybind key={`keybind${index}`} defaultValue={settingToChange === key ? "waiting..." : value} keybind={key as SettingTypes} />
				))}
			</div>
		</Modal>
	);
};

export default ModalSettings;
