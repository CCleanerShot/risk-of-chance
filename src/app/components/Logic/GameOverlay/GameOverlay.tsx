"use client";

import React, { useEffect, useState } from "react";
import Movable from "../../UI/Movable";
import Back from "./shards/Back";
import { GameStatusTypes, SupabaseSessionStatusTypes } from "@/types";
import GlobalStore from "@/common/global_store";
import Load from "./shards/Load";
import Save from "./shards/Save";
import H2 from "../../UI/H2";
import Settings from "./shards/Settings";

const GameOverlay = () => {
	const [sessionStatus, setSessionStatus] = useState<SupabaseSessionStatusTypes>("loading");
	const [gameStatus, setGameStatus] = useState<GameStatusTypes>(GlobalStore.getFromStore("game").game.gameStatus);

	const listenToGame = () => {
		const newStatus = GlobalStore.getFromStore("game").game.gameStatus;
		setGameStatus(newStatus);
	};

	const listenToSessionStatus = () => {
		const newSessionStatus = GlobalStore.getFromStore("supabaseSession").status;
		setSessionStatus(newSessionStatus);
	};

	useEffect(() => {
		GlobalStore.AddListener("game", listenToGame);
		GlobalStore.AddListener("supabaseSession", listenToSessionStatus);

		listenToGame();
		listenToSessionStatus();
	}, []);

	return (
		<Movable defaultPosition={{ x: "left", y: "top" }}>
			<div className="grid grid-cols-2 gap-2 p-4 px-8 border-4 border-slate-900 bg-slate-700">
				<H2>Control Panel</H2>
				<Back currentStatus={gameStatus} className="p-1" />
				<Settings />
				<Load disabled={sessionStatus === "loading"} className="p-1" />
				<Save disabled={sessionStatus === "loading"} className="p-1" />
				<span className="text-slate-400 text-sm italic text-center">move me!</span>
			</div>
		</Movable>
	);
};

export default GameOverlay;
