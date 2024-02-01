"use client";

import React from "react";
import Button from "@/app/components/UI/Button";
import Utils from "@/common/utils/utils";
import GlobalStore from "@/common/global_store";
import { SettingTypes } from "@/types";

interface KeybindProps {
	defaultValue: string;
	keybind: SettingTypes;
}

const Keybind = ({ defaultValue, keybind }: KeybindProps) => {
	const handleOnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		GlobalStore.Update("settingToChange", "settingToChange", keybind);

		const listener = (ev: KeyboardEvent) => {
			const code = ev.code.replace("Key", "");
			GlobalStore.Update("settings", "settings", (oldSettings) => ({ ...oldSettings, [keybind]: code }));
			GlobalStore.Update("settingToChange", "settingToChange", null);
			document.removeEventListener("keypress", listener);
		};

		document.addEventListener("keypress", listener);
	};

	return (
		<div className="flex items-center">
			<div className="w-36">{Utils.formatVariableString(keybind).toUpperCase()}</div>
			<Button onClick={handleOnClick} template="none" className="grid place-items-center">
				<input type="text" maxLength={10} value={defaultValue} width={5} className="w-24 h-8 text-center" readOnly />
			</Button>
		</div>
	);
};

export default Keybind;
