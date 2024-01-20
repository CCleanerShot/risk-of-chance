"use client";

import GlobalStore from "@/common/global_store";
import React, { useEffect, useState } from "react";
import GetStarted from "./GetStarted";
import Game from "./Game";
import Corner from "../UI/Corner";
import { SizeTypes, StatusColorTypes } from "@/types";

const View = () => {
	const cornerSize: SizeTypes = "medium";
	const [color, setColor] = useState<StatusColorTypes>("red");
	const [gettingStarted, setGettingStarted] = useState<boolean>(true);

	const listenToColor = () => {
		const color = GlobalStore.getFromGlobalStore("statusColor").statusColor;
		setColor(color);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("statusColor", listenToColor);
	}, []);

	const supabaseSession = GlobalStore.getFromGlobalStore("supabaseSession");
	if (supabaseSession.status === "valid") {
		setGettingStarted(false);
	}

	return (
		<div>
			<div className="flex justify-between bg-slate-700">
				<Corner color={color} facing="down-right" size={cornerSize} />
				<Corner color={color} facing="down-left" size={cornerSize} />
			</div>
			{gettingStarted ? <GetStarted /> : <Game />}
			<div className="flex justify-between bg-slate-700">
				<Corner color={color} facing="up-right" size={cornerSize} />
				<Corner color={color} facing="up-left" size={cornerSize} />
			</div>
		</div>
	);
};

export default View;
