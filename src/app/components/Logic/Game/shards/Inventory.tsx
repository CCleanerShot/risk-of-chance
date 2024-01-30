"use client";

import React, { useEffect, useState } from "react";
import Utils from "@/common/utils/utils";
import ItemContainer from "./ItemContainer";
import UtilsGame from "@/common/utils/utils_game";
import GlobalStore from "@/common/global_store";
import H1 from "@/app/components/UI/H1";
import { ActorTypes, SizeTypes, Item } from "@/types";

interface InventoryProps {
	size: SizeTypes;
	source: ActorTypes;
}

const Inventory = ({ size, source }: InventoryProps) => {
	const [inventory, setInventory] = useState<(Item | null)[]>(Utils.MakeArray(UtilsGame.maxStorage.inventory[source], (i) => null) as (Item | null)[]);

	const listenForInventory = () => {
		const newInventory = GlobalStore.getFromStore("inventory").inventory[source];
		newInventory?.length && setInventory(inventory.map((v, i) => (newInventory[i] ? newInventory[i] : null)));
	};

	useEffect(() => {
		GlobalStore.AddListener("inventory", listenForInventory);
		listenForInventory();
	}, []);

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

	return (
		<div>
			<H1>Inventory</H1>
			<div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.round(Math.sqrt(inventory.length))}, minmax(0, 1fr))` }}>
				{inventory.map((item, index) => {
					return <ItemContainer key={`inventory${index}`} item={item} size={size} source="inventory" />;
				})}
			</div>
		</div>
	);
};

export default Inventory;
