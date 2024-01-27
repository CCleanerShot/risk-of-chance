"use effect";

import React, { useEffect, useState } from "react";
import Floors from "./shards/Floors";
import Backpack from "./shards/Backpack";
import { GameStatusTypes } from "@/types/game";
import GlobalStore from "@/common/global_store";
import Inventory from "./shards/Inventory";
import Battle from "./shards/Battle";
import Loot from "./shards/Loot";

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
		case "loot":
			return <Loot />;
		case "start":
			return (
				<div className="flex-1 flex justify-around">
					<div className="flex gap-2">
						<Backpack source="player" />
						<Inventory size="small" source="player" />
					</div>
					<Floors />
				</div>
			);
	}
};

export default Game;
