"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import { Backpack, Dice, backpackConst } from "@/types/game";
import UtilsSupabase from "@/common/utils/utils_supabase";
import { SupabaseSession } from "@/types";

const Backpack = () => {
	const [backpack, setBackpack] = useState<Backpack>([]);
	const listenToUpdate = async () => {
		await UtilsSupabase.Load();
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
		<div className="border">
			{backpack.map((item, index) => {
				console.log(item);
				if (item["type"] === "dice") {
					const _item = item as Dice;
					return <div key={index}>{_item.sides}</div>;
				} else {
					return <div>{item.type}</div>;
				}
			})}
		</div>
	);
};

export default Backpack;

// manual save doesnt matter
