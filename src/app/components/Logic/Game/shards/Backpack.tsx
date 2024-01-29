"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import { Backpack } from "@/types/game";
import UtilsSupabase from "@/common/utils/utils_supabase";
import UtilsGame from "@/common/utils/utils_game";
import Utils from "@/common/utils/utils";
import ItemContainer from "./ItemContainer";
import Button from "@/app/components/UI/Button";
import H1 from "@/app/components/UI/H1";
import { NPCTypes } from "@/types/local";
import Gold from "./Gold";

interface BackpackProps {
	source: NPCTypes;
}

const Backpack = ({ source }: BackpackProps) => {
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

	const Container = ({ children }: { children?: React.ReactNode }) => (
		<Button onClick={() => {}} template="green_border" className="w-8 h-8 flex">
			{children}
		</Button>
	);

	return (
		<div>
			<H1>Backpack</H1>
			<div className="grid grid-cols-10 gap-1">
				{Utils.MakeArray(UtilsGame.maxStorage.backpack["player"], (i) => i).map((index) => (
					<Container key={`item${index}`}>{backpack[index] ? <ItemContainer item={backpack[index]} origin="backpack" /> : <div></div>}</Container>
				))}
			</div>
			<Gold />
		</div>
	);
};

export default Backpack;

// manual save doesnt matter
