"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import UtilsGame from "@/common/utils/utils_game";

const SettingsHandler = () => {
	const handleKeyPress = (e: KeyboardEvent) => {
		const code = e.code.replace("Key", "");
		const { deleteItem, moveItem } = GlobalStore.getFromStore("settings").settings;
		const currentStage = GlobalStore.getFromStore("game").game.gameStatus;
	};

	useEffect(() => {
		document.addEventListener("keypress", handleKeyPress);
	}, []);

	return <></>;
};

export default SettingsHandler;
