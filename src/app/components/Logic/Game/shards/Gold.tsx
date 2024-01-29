"use client";

import GlobalStore from "@/common/global_store";
import Utils from "@/common/utils/utils";
import React, { useEffect, useState } from "react";
import { TbCoinFilled } from "react-icons/tb";

const Gold = () => {
	const [gold, setGold] = useState(GlobalStore.getFromGlobalStore("gold").gold);
	const listenToGold = () => {
		const newGold = GlobalStore.getFromGlobalStore("gold").gold;
		setGold(gold);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("gold", listenToGold);
	}, []);
	return (
		<div className="flex justify-start items-center gap-1">
			<TbCoinFilled color="gold" />
			<div className="font-bold">{Utils.FormatNumber(gold)}</div>
		</div>
	);
};

export default Gold;
