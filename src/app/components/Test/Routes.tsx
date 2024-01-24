"use client";

import React from "react";
import { queries } from "@/common/utils/utils_supabase";

import Route from "./Route";

const Routes = () => {
	const queriesAll = queries;
	const dataAll = Object.entries(queriesAll).map((kv) => {
		return { key: kv[0], value: kv[1] as (args?: any) => any };
	});

	return (
		<div className="border flex flex-col sticky top-0 bg-red-100">
			<div className="flex gap-2 items-center">
				<div className="font-bold">Current Queries</div>
				<span className="text-red-700">FOR TESTING ONLY</span>
			</div>
			<div className="flex flex-col gap-2 px-2">{dataAll && dataAll.map((k, i) => <Route key={`${k.key} + ${i}`} keyString={k.key} routeFunction={k.value} />)}</div>
		</div>
	);
};

export default Routes;
