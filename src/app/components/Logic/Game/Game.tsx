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
import Exit from "./shards/Exit";
import Shop from "./shards/Shop";
import UtilsGame from "@/common/utils/utils_game";
import Button from "../../UI/Button";

const Game = () => {
	const [gameScreen, setGameScreen] = useState<GameStatusTypes>("start");

	const listenToGame = () => {
		const game = GlobalStore.getFromStore("game").game;
		setGameScreen(game.gameStatus);
	};

	useEffect(() => {
		UtilsGame.Initialize();
		GlobalStore.AddListener("game", listenToGame);
	}, []);

	const BackButtonComponent = (status: GameStatusTypes) => {
		const handleClick = () => {
			switch (status) {
				case "battle":
				case "exit":
				case "results":
				case "start":
					GlobalStore.Update("updateMessage", "updateMessage", { msg: "what how did this happen? bug lol", type: "warn" });
					break;
				case "shop":
					GlobalStore.Update("game", "game", ({ currentFloor, gameStatus }) => ({ currentFloor, gameStatus: "start" }));
					break;
			}
		};

		const DisabledButtonComponent = () => (
			<Button template="green_border" disabled={true} className="mt-2 line-through text-slate-800">
				BACK
			</Button>
		);

		const WorkingButtonComponent = (status: GameStatusTypes) => (
			<Button template="green_border" onClick={() => handleClick()} className="mt-2">
				BACK
			</Button>
		);

		switch (status) {
			case "battle":
			case "exit":
			case "results":
			case "start":
				return DisabledButtonComponent();
			case "shop":
				return WorkingButtonComponent("shop");
		}
	};

	const ScreenComponent = () => {
		switch (gameScreen) {
			case "battle":
				return <Battle />;
			case "results":
				return <Results />;
			case "start":
				return <Start />;
			case "exit":
				return <Exit />;
			case "shop":
				return <Shop />;
		}
	};

	return <div className="flex-1 flex justify-center items-center">{ScreenComponent()}</div>;
};

export default Game;
