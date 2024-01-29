"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import Utils from "@/common/utils/utils";
import Gold from "./Gold";

const GoldTotal = () => {
	const [gold, setGold] = useState(GlobalStore.getFromGlobalStore("gold").gold);
	const listenToGold = () => {
		const newGold = GlobalStore.getFromGlobalStore("gold").gold;
		setGold(gold);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("gold", listenToGold);
	}, []);
	return <Gold>{Utils.FormatNumber(gold)}</Gold>;
};

export default GoldTotal;
