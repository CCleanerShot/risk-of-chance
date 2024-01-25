"use client";

import React, { useEffect, useState } from "react";
import Utils from "@/common/utils/utils";
import { Item } from "@/types/game";
import ItemContainer from "./ItemContainer";
import UtilsGame from "@/common/utils/utils_game";
import GlobalStore from "@/common/global_store";
import Button from "@/app/components/UI/Button";

const Inventory = () => {
	const [inventory, setInventory] = useState<(Item | null)[]>(Utils.MakeArray(UtilsGame.MAX_INVENTORY_SIZE, (i) => ({ type: "dice" })) as (Item | null)[]);

	const listenForInventory = () => {
		const inventory = GlobalStore.getFromGlobalStore("inventory").inventory;
		setInventory([...inventory]);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("inventory", listenForInventory);
	}, []);

	return (
		<div>
			<h1 className="font-bold underline text-lg text-center">Inventory</h1>
			<div className="grid grid-cols-3 gap-1">
				{inventory.map((item, index) => {
					if (item === null) {
						return <Button onClick={() => {}} template="green_border" className="w-8 h-8 border border-white"></Button>;
					} else {
						return <ItemContainer key={`inventory${index}`} item={item} className="w-8 h-8" origin="inventory" />;
					}
				})}
			</div>
		</div>
	);
};

export default Inventory;
