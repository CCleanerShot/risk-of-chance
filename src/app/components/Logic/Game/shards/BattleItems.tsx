"use effect";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import { Item } from "@/types/game";
import Utils from "@/common/utils/utils";
import UtilsGame from "@/common/utils/utils_game";
import ItemContainer from "./ItemContainer";
import Button from "@/app/components/UI/Button";

const BattleItems = () => {
	const [items, setItems] = useState<Item[]>([]);

	const listenToChosenBattleItems = () => {
		const newItems = GlobalStore.getFromGlobalStore("chosenBattleItems").chosenBattleItems;
		setItems([...newItems]);
	};

	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {};
	useEffect(() => {
		GlobalStore.AddListenerToVariable("chosenBattleItems", listenToChosenBattleItems);
	}, []);

	return (
		<div className="grid grid-cols-3 gap-1">
			{Utils.MakeArray(UtilsGame.MAX_BATTLE_ITEMS_SIZE, (i) => i + 1).map((index) => {
				if (items[index]) {
					return <ItemContainer key={`battle-item${index}`} item={items[index]} origin="battle_items" className="w-10 h-10" />;
				} else {
					return <Button onClick={handleClick} template="green_border" className="w-12 h-12"></Button>;
				}
			})}
		</div>
	);
};

export default BattleItems;
