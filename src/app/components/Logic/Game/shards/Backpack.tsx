"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import { Backpack, Dice } from "@/types/game";
import UtilsSupabase from "@/common/utils/utils_supabase";

const Backpack = () => {
	const [backpack, setBackpack] = useState<Backpack>([]);
	const getBackpackFromSupabase = async (): Promise<Backpack> => {
		const supabaseClient = GlobalStore.getFromGlobalStore("supabaseClient").supabaseClient;
		const session = await (await supabaseClient.auth.getSession()).data.session;

		if (session) {
			const data = await UtilsSupabase.GetQuery("getBackpackByUserOrigin").callQuery(session.user.id);
		}

		return [];
	};

	useEffect(() => {
		async function execute() {
			const backpack = await getBackpackFromSupabase();
		}

		execute();
	}, []);

	return <div>Backpack</div>;
};

export default Backpack;

// manual save doesnt matter
