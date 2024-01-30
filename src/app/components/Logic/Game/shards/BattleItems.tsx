"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import Utils from "@/common/utils/utils";
import UtilsGame from "@/common/utils/utils_game";
import ItemContainer from "./ItemContainer";
import Button from "@/app/components/UI/Button";
import { ActorTypes, Item, SizeTypes } from "@/types";
import { twMerge } from "tailwind-merge";

interface BattleItemsProps {
	source: ActorTypes;
	size: SizeTypes;
	disabled?: boolean;
}

const BattleItems = ({ source, size, disabled = false }: BattleItemsProps) => {
	const [items, setItems] = useState<(Item | null)[]>(GlobalStore.getFromStore("battleItems").battleItems[source]);

	const listenToBattleItems = () => {
		const newItems = GlobalStore.getFromStore("battleItems").battleItems[source];
		setItems([...newItems]);
	};

	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {};

	useEffect(() => {
		GlobalStore.AddListener("battleItems", listenToBattleItems);
	}, []);

	let backgroundStyles = "";
	switch (source) {
		case "enemy":
			backgroundStyles = "bg-red-800";
			break;
		case "player":
			backgroundStyles = "bg-green-800";
			break;
	}
	return (
		<div className="grid grid-cols-3 gap-1">
			{Utils.MakeArray(UtilsGame.maxStorage.battleItems[source], (i) => i).map((index) => {
				if (items[index]) {
					return <ItemContainer disabled={disabled} key={`battle-item${index}`} item={items[index]!} source="battleItems" size={size} className={twMerge(backgroundStyles, "")} />;
				} else {
					return <Button disabled={disabled} key={`battle-item${index}`} onClick={handleClick} template="green_border" size={size}></Button>;
				}
			})}
		</div>
	);
};

export default BattleItems;
