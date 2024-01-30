"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import { Item, SizeTypes } from "@/types";
import ItemContainer from "./ItemContainer";
import UtilsGame from "@/common/utils/utils_game";
import Utils from "@/common/utils/utils";

interface TrashcanProps {
	size: SizeTypes;
}

const Trashcan = ({ size }: TrashcanProps) => {
	const [trashcan, setTrashcan] = useState<Item[]>(GlobalStore.getFromGlobalStore("trashcan").trashcan);

	const listenToTrashcan = () => {
		const newTrashcan = GlobalStore.getFromGlobalStore("trashcan").trashcan;
		setTrashcan(newTrashcan);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("trashcan", listenToTrashcan);
		listenToTrashcan();
	}, []);

	return (
		<div className="">
			{Utils.MakeArray(UtilsGame.maxStorage.trashcan.player, () => null).map((item) => (
				<ItemContainer item={item} size={size} source="trashcan" />
			))}
		</div>
	);
};

export default Trashcan;
