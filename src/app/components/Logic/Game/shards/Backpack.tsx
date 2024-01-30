"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import UtilsSupabase from "@/common/utils/utils_supabase";
import UtilsGame from "@/common/utils/utils_game";
import Utils from "@/common/utils/utils";
import ItemContainer from "./ItemContainer";
import H1 from "@/app/components/UI/H1";
import { ActorTypes, Backpack, SizeTypes } from "@/types";
import GoldTotal from "./GoldTotal";

interface BackpackProps {
	size: SizeTypes;
	source: ActorTypes;
}

const Backpack = ({ size, source }: BackpackProps) => {
	const [tabNumber, setTabNumber] = useState(1);
	const [backpack, setBackpack] = useState<Backpack>([]);

	const listenToUpdate = async () => {
		const backpack = GlobalStore.getFromGlobalStore("backpack").backpack;
		setBackpack(backpack);
	};

	useEffect(() => {
		async function execute() {
			GlobalStore.AddListenerToVariable("backpack", listenToUpdate);
			GlobalStore.AddListenerToVariable("supabaseSession", listenToUpdate);
			await UtilsSupabase.Load();
		}

		execute();
	}, []);

	return (
		<div>
			<H1>Backpack</H1>
			<div className="grid grid-cols-10 gap-1">{Utils.MakeArray(UtilsGame.maxStorage.backpack["player"], (i) => i).map((index) => (backpack[index] ? <ItemContainer item={backpack[index]} origin="backpack" size={size} /> : <ItemContainer item={null} origin="backpack" size={size} />))}</div>
			<GoldTotal />
		</div>
	);
};

export default Backpack;

// manual save doesnt matter
