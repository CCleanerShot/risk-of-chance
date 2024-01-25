"use client";
import React, { useEffect, useState } from "react";
import Button from "@/app/components/UI/Button";
import GlobalStore from "@/common/global_store";
import { Dice, Item } from "@/types/game";
import { twMerge } from "tailwind-merge";

// TODO: refactor from 100 different buttons listening on everything, to a radio-like system where only the submit button knows

interface ItemButtonProps {
	item: Item;
	className?: string;
}

const ItemButton = ({ item, className }: ItemButtonProps) => {
	const [isSelected, setIsSelected] = useState(false);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		GlobalStore.UpdateVariableProperty("viewSelected", "itemSelect", item);
	};

	const listenToViewSelected = () => {
		const { itemSelect, levelSelect } = GlobalStore.getFromGlobalStore("viewSelected");
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
		<Button template="green_border" className={twMerge(" text-white border border-slate-900 p-1", isSelected ? "text-green-500" : "", className)} onClick={handleClick}>
			<Contents />
		</Button>
	);
};

export default ItemButton;
