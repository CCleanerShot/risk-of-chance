"use effect";

import React, { useEffect, useState } from "react";
import Levels from "./shards/Levels";
import Backpack from "./shards/Backpack";
import { GameStatusTypes } from "@/types/game";
import GlobalStore from "@/common/global_store";

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
			return <div></div>;
		case "start":
			return (
				<div className="flex-1 flex justify-around">
					<Backpack />
					<Levels />
				</div>
			);
		case "loot":
			return <div>Loot</div>;
	}
};

export default Game;
