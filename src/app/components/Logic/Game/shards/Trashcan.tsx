"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import { Item } from "@/types";
import ItemContainer from "./ItemContainer";

const Trashcan = () => {
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
			{trashcan.map((item) => (
				<ItemContainer item={item} size="small" origin="trashcan" />
			))}
		</div>
	);
};

export default Trashcan;
