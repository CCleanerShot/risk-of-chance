"use client";
import React, { useEffect, useState } from "react";
import Button from "@/app/components/UI/Button";
import GlobalStore from "@/common/global_store";
import { Dice, Item } from "@/types/game";
import { twMerge } from "tailwind-merge";
import { StorageTypes } from "@/types";

// TODO: refactor from 100 different buttons listening on everything, to a radio-like system where only the submit button knows

interface ItemContainerProps {
	item: Item;
	origin: StorageTypes;
	className?: string;
	disabled?: boolean;
}

const ItemContainer = ({ item, origin, className, disabled = false }: ItemContainerProps) => {
	const [isSelected, setIsSelected] = useState(false);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const currentStage = GlobalStore.getFromGlobalStore("game").game.gameStatus.type;
		switch (origin) {
			case "backpack": {
			}
		}
		GlobalStore.UpdateVariableProperty("viewSelected", "itemSelect", item);
	};

	const listenToViewSelected = () => {
		const { itemSelect, floorSelect } = GlobalStore.getFromGlobalStore("viewSelected");
		setIsSelected(itemSelect === item);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("viewSelected", listenToViewSelected);
	}, []);

	const Contents = () => {
		switch (item.type) {
			case "dice": {
				const _item = item as Dice;
				return <div>{_item.sides}</div>;
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
		<Button disabled={disabled} template="green_border" className={twMerge(" text-white border border-slate-900 p-1", isSelected ? "text-green-600" : "", className)} onClick={handleClick}>
			<Contents />
		</Button>
	);
};

export default ItemContainer;
