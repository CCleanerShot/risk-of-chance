"use effect";

import React, { useEffect, useState } from "react";
import Floors from "./shards/Floors";
import Backpack from "./shards/Backpack";
import { GameStatusTypes } from "@/types";
import GlobalStore from "@/common/global_store";
import Inventory from "./shards/Inventory";
import Battle from "./shards/Battle";
import Results from "./shards/Results";
import Start from "./shards/Start";

const Game = () => {
	const [gameScreen, setGameScreen] = useState<GameStatusTypes>({ type: "start" });

	const listenToGame = () => {
		const game = GlobalStore.getFromStore("game").game;
		setGameScreen(game.gameStatus);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("game", listenToGame);
	}, []);

	switch (gameScreen.type) {
		case "battle":
			return <Battle />;
		case "results":
			return <Results />;
		case "start":
			return <Start />;
	}
};

export default Game;
