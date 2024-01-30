"use client";

import React from "react";
import Button from "@/app/components/UI/Button";
import GlobalStore from "@/common/global_store";
import { twMerge } from "tailwind-merge";
import { Item, SizeTypes, StorageTypes } from "@/types";
import UtilsGame from "@/common/utils/utils_game";

// TODO: refactor from 100 different buttons listening on everything, to a radio-like system where only the submit button knows

interface ItemContainerProps {
	item: Item;
	origin: StorageTypes;
	size: SizeTypes;
	className?: string;
	disabled?: boolean;
}

const ItemContainer = ({ item, origin, size, className, disabled = false }: ItemContainerProps) => {
	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const currentStage = GlobalStore.getFromGlobalStore("game").game.gameStatus.type;
		switch (currentStage) {
			case "battle":
				origin === "backpack" && GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
				origin === "battleItems" && UtilsGame.MoveItem("player", item, origin, "inventory");
				origin === "inventory" && UtilsGame.MoveItem("player", item, origin, "battleItems");
				origin === "rewards" && GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
				break;
			case "start":
				origin === "backpack" && UtilsGame.MoveItem("player", item, origin, "inventory");
				origin === "battleItems" && GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
				origin === "inventory" && UtilsGame.MoveItem("player", item, origin, "backpack");
				origin === "rewards" && GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
				break;
			case "results":
				origin === "backpack" && GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
				origin === "battleItems" && GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
				origin === "inventory" && UtilsGame.MoveItem("player", item, origin, "rewards");
				origin === "rewards" && UtilsGame.MoveItem("player", item, origin, "inventory");
				break;
			default:
				GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: "Cannot move: unhandled behavior (contact dev plz)", type: "error" });
				break;
		}

		GlobalStore.UpdateVariableProperty("viewSelected", "itemSelect", item);
	};

	let sizeStyles: string;
	switch (size) {
		case "largest":
			sizeStyles = "w-24 h-24";
			break;
		case "large":
			sizeStyles = "w-20 h-20";
			break;
		case "medium":
			sizeStyles = "w-16 h-16";
			break;
		case "small":
			sizeStyles = "w-12 h-12";
			break;
		case "smallest":
			sizeStyles = "w-8 h-8";
			break;
	}

	const Contents = () => {
		if (item == null) {
			return <div></div>;
		}

		switch (item.type) {
			case "dice": {
				const _item = item as Item<"dice">;
				return <div className={item.disabled ? "line-through text-red-500" : ""}>{_item.sides}</div>;
			}

			case "health": {
				return <div>health</div>;
			}

			default: {
				return <div>???</div>;
			}
		}
	};

	return (
		<Button disabled={disabled || item?.disabled} template="green_border" className={twMerge(sizeStyles, "text-white border-slate-900 p-1", className)} onClick={handleClick}>
			<Contents />
		</Button>
	);
};

export default ItemContainer;
