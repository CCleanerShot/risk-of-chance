"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import { Item } from "@/types/game";
import Utils from "@/common/utils/utils";
import UtilsGame from "@/common/utils/utils_game";
import ItemContainer from "./ItemContainer";
import Button from "@/app/components/UI/Button";
import { NPCTypes } from "@/types/local";

interface BattleItemsProps {
	source: NPCTypes;
	disabled?: boolean;
}

const BattleItems = ({ source, disabled = false }: BattleItemsProps) => {
	const [items, setItems] = useState<Item[]>(GlobalStore.getFromGlobalStore("battleItems").battleItems[source]);

	const listenToBattleItems = () => {
		const newItems = GlobalStore.getFromGlobalStore("battleItems").battleItems[source];
		console.log(newItems);
		setItems([...newItems]);
	};

	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("battleItems", listenToBattleItems);
	}, []);

	return (
		<div className="grid grid-cols-3 gap-1">
			{Utils.MakeArray(UtilsGame.MAX_BATTLE_ITEMS_SIZE, (i) => i + 1).map((index) => {
				if (items[index]) {
					console.log("true");
					return <ItemContainer disabled={disabled} key={`battle-item${index}`} item={items[index]} origin="battle_items" className="w-10 h-10" />;
				} else {
					return <Button disabled={disabled} key={`battle-item${index}`} onClick={handleClick} template="green_border" className="w-12 h-12"></Button>;
				}
			})}
		</div>
	);
};

export default BattleItems;
