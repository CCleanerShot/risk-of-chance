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
		const backpack = GlobalStore.getFromStore("backpack").backpack;
		setBackpack(backpack);
	};

	useEffect(() => {
		async function execute() {
			GlobalStore.AddListener("backpack", listenToUpdate);
			GlobalStore.AddListener("supabaseSession", listenToUpdate);
			await UtilsSupabase.Load();
		}

		execute();
	}, []);

	return (
		<div>
			<H1>Backpack</H1>
			<div className="grid grid-cols-10 gap-1">
				{Utils.MakeArray(UtilsGame.maxStorage.backpack["player"], (i) => null).map((v, i) => (backpack[i] ? <ItemContainer key={`backpack${i}`} item={backpack[i]} source="backpack" size={size} /> : <ItemContainer key={`backpack${i}`} item={null} source="backpack" size={size} />))}
			</div>
		</div>
	);
};

export default Backpack;

// manual save doesnt matter
