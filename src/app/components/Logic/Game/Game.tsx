"use effect";

import React, { useEffect, useState } from "react";
import Floors from "./shards/Floors";
import Backpack from "./shards/Backpack";
import { GameStatusTypes } from "@/types/game";
import GlobalStore from "@/common/global_store";
import Inventory from "./shards/Inventory";
import Battle from "./shards/Battle";

const Game = () => {
	const [gameScreen, setGameScreen] = useState<GameStatusTypes>({ type: "start" });

	const listenToGame = () => {
		const game = GlobalStore.getFromGlobalStore("game").game;
		setGameScreen(game.gameStatus);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("game", listenToGame);
	}, []);

	switch (gameScreen.type) {
		case "battle":
			return <Battle />;
		case "start":
			return (
				<div className="flex-1 flex justify-around">
					<div className="flex gap-2">
						<Backpack />
						<Inventory size="small" />
					</div>
					<Floors />
				</div>
			);
		case "loot":
			return <div>Loot</div>;
	}
};

export default Game;
