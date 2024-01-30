"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import { Item, SizeTypes } from "@/types";
import ItemContainer from "./ItemContainer";
import UtilsGame from "@/common/utils/utils_game";
import Utils from "@/common/utils/utils";

interface TrashCanProps {
	size: SizeTypes;
}

const TrashCan = ({ size }: TrashCanProps) => {
	const [trashCan, setTrashCan] = useState<Item[]>(GlobalStore.getFromStore("trashCan").trashCan);

	const listenToTrashCan = () => {
		const newTrashCan = GlobalStore.getFromStore("trashCan").trashCan;
		setTrashCan(newTrashCan);
	};

	useEffect(() => {
		GlobalStore.AddListener("trashCan", listenToTrashCan);
		listenToTrashCan();
	}, []);

	return (
		<div className="">
			{Utils.MakeArray(UtilsGame.maxStorage.trashCan.player, () => null).map((item, i) => (
				<ItemContainer key={`trashcan${i}`} item={item} size={size} source="trashCan" />
			))}
		</div>
	);
};

export default TrashCan;
