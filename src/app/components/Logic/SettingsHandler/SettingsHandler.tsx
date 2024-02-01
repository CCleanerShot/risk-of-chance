"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import UtilsGame from "@/common/utils/utils_game";

const SettingsHandler = () => {
	const handleKeyPress = (e: KeyboardEvent) => {
		const code = e.code.replace("Key", "");
		const { deleteItem, moveItem } = GlobalStore.getFromStore("settings").settings;
		const currentStage = GlobalStore.getFromStore("game").game.gameStatus;
		const { item, source } = GlobalStore.getFromStore("selectedItem").selectedItem;

		switch (true) {
			case code === deleteItem:
				UtilsGame.MoveItem("player", item, source, "trashCan");
				break;
			case code === moveItem:
				switch (currentStage) {
					case "battle":
						source === "backpack" && GlobalStore.Update("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
						source === "battleItems" && UtilsGame.MoveItem("player", item, source, "inventory");
						source === "inventory" && UtilsGame.MoveItem("player", item, source, "battleItems");
						source === "rewards" && GlobalStore.Update("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
						break;
					case "start":
						source === "backpack" && UtilsGame.MoveItem("player", item, source, "inventory");
						source === "battleItems" && GlobalStore.Update("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
						source === "inventory" && UtilsGame.MoveItem("player", item, source, "backpack");
						source === "rewards" && GlobalStore.Update("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
						break;
					case "results":
						source === "backpack" && GlobalStore.Update("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
						source === "battleItems" && GlobalStore.Update("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
						source === "inventory" && UtilsGame.MoveItem("player", item, source, "rewards");
						source === "rewards" && UtilsGame.MoveItem("player", item, source, "inventory");
						break;
					default:
						GlobalStore.Update("updateMessage", "updateMessage", { msg: "Cannot move: unhandled behavior (contact dev plz)", type: "error" });
						break;
				}
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		document.addEventListener("keypress", handleKeyPress);
	}, []);

	return <></>;
};

export default SettingsHandler;
