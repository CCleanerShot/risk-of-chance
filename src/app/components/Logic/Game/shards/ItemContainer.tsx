"use client";

import React from "react";
import Button from "@/app/components/UI/Button";
import GlobalStore from "@/common/global_store";
import { twMerge } from "tailwind-merge";
import { Item, SizeTypes, StorageTypes } from "@/types";
import UtilsGame from "@/common/utils/utils_game";
import { FaTrashCan } from "react-icons/fa6";

// TODO: refactor from 100 different buttons listening on everything, to a radio-like system where only the submit button knows

interface ItemContainerProps {
	item: Item;
	source: StorageTypes;
	size: SizeTypes;
	className?: string;
	disabled?: boolean;
}

const ItemContainer = ({ item, source, size, className, disabled = false }: ItemContainerProps) => {
	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const currentStage = GlobalStore.getFromGlobalStore("game").game.gameStatus.type;
		switch (currentStage) {
			case "battle":
				source === "backpack" && GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
				source === "battleItems" && UtilsGame.MoveItem("player", item, source, "inventory");
				source === "inventory" && UtilsGame.MoveItem("player", item, source, "battleItems");
				source === "rewards" && GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
				break;
			case "start":
				source === "backpack" && UtilsGame.MoveItem("player", item, source, "inventory");
				source === "battleItems" && GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
				source === "inventory" && UtilsGame.MoveItem("player", item, source, "backpack");
				source === "rewards" && GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
				break;
			case "results":
				source === "backpack" && GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
				source === "battleItems" && GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: "Cannot move: unexpected error! (contact dev plz)", type: "error" });
				source === "inventory" && UtilsGame.MoveItem("player", item, source, "rewards");
				source === "rewards" && UtilsGame.MoveItem("player", item, source, "inventory");
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
			return <div className="grid place-items-center">{source === "trashcan" ? <FaTrashCan color="gray" /> : <></>}</div>;
		}

		switch (item.type) {
			case "dice": {
				const _item = item as Item<"dice">;
				return <div className={item.disabled ? "line-through text-red-500" : ""}>{_item.sides}</div>;
			}

			case "health": {
				return <div className={item.disabled ? "line-through text-red-500" : ""}>health</div>;
			}

			default: {
				return <div>???</div>;
			}
		}
	};

	return (
		<Button disabled={disabled || !item || item.disabled} template="green_border" className={twMerge(sizeStyles, "text-white border-slate-900 p-1", className)} onClick={handleClick}>
			<Contents />
		</Button>
	);
};

export default ItemContainer;
