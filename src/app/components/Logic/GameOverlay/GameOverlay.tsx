"use client";

import React, { useEffect, useState } from "react";
import Movable from "../../UI/Movable";
import Back from "./shards/Back";
import { GameStatusTypes } from "@/types";
import GlobalStore from "@/common/global_store";
import Load from "./shards/Load";
import Save from "./shards/Save";
import H2 from "../../UI/H2";
import Settings from "./shards/Settings";

const GameOverlay = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [gameStatus, setGameStatus] = useState<GameStatusTypes>(GlobalStore.getFromStore("game").game.gameStatus);

	const listenToGame = () => {
		const newStatus = GlobalStore.getFromStore("game").game.gameStatus;
		setGameStatus(newStatus);
	};

	useEffect(() => {
		GlobalStore.AddListener("game", listenToGame);
		GlobalStore.AddStandardListener("isLoading", "isLoading", setIsLoading);
		listenToGame();
	}, []);

	return (
		<Movable defaultPosition={{ x: "left", y: "top" }} isDraggedStyles="bg-slate-700">
			<H2>Control Panel</H2>
			<div className="grid grid-cols-2  gap-2 items-center p-4 border-4 border-slate-900 bg-slate-700">
				<Back currentStatus={gameStatus} className="p-1" />
				<Settings disabled={false} className="p-1" />
				<Load disabled={gameStatus !== "start" && gameStatus !== "shop"} className="p-1" />
				<Save disabled={gameStatus !== "start" && gameStatus !== "shop"} className="p-1" />
				<span className="text-slate-400 text-sm italic text-center col-span-2">move me!</span>
			</div>
		</Movable>
	);
};

export default GameOverlay;
