"use client";

import React, { useEffect, useState } from "react";
import Utils from "@/common/utils/utils";
import { Item } from "@/types/game";
import ItemContainer from "./ItemContainer";
import UtilsGame from "@/common/utils/utils_game";
import GlobalStore from "@/common/global_store";
import Button from "@/app/components/UI/Button";
import { SizeTypes } from "@/types";
import { twMerge } from "tailwind-merge";
import H1 from "@/app/components/UI/H1";
import { NPCTypes } from "@/types/local";

interface InventoryProps {
	size: SizeTypes;
	source: NPCTypes;
}

const Inventory = ({ size, source }: InventoryProps) => {
	const [inventory, setInventory] = useState<(Item | null)[]>(Utils.MakeArray(UtilsGame.maxStorage.inventory[source], (i) => null) as (Item | null)[]);

	const listenForInventory = () => {
		const newInventory = GlobalStore.getFromGlobalStore("inventory").inventory[source];
		newInventory?.length && setInventory([...newInventory]);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("inventory", listenForInventory);
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
			<div className="grid grid-cols-3 gap-1">
				{inventory.map((item, index) => {
					if (item === null) {
						return <Button key={`inventory${index}`} onClick={() => {}} template="green_border" className={twMerge(sizeStyles)}></Button>;
					} else {
						return <ItemContainer key={`inventory${index}`} item={item} className={twMerge(sizeStyles, "")} origin="inventory" />;
					}
				})}
			</div>
		</div>
	);
};

export default Inventory;
