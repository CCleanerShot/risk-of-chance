"use client";

import React, { useEffect, useState } from "react";
import Inventory from "./Inventory";
import BattleItems from "./BattleItems";
import Button from "@/app/components/UI/Button";
import GlobalStore from "@/common/global_store";
import Health from "./Health";
import H1 from "@/app/components/UI/H1";
import H2 from "@/app/components/UI/H2";
import UtilsGame from "@/common/utils/utils_game";
import { twMerge } from "tailwind-merge";

const Battle = () => {
	function checkIfItemsMax(): boolean {
		const array = GlobalStore.getFromGlobalStore("battleItems").battleItems.player;
		const arrayWithItems = array.filter((i) => i?.type);
		return arrayWithItems.length >= UtilsGame.maxStorage.battleItems.player;
	}

	const [floor, setFloor] = useState(GlobalStore.getFromGlobalStore("game").game.currentFloor);
	const [isReady, setIsReady] = useState(checkIfItemsMax());
	const handleBattle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		UtilsGame;
	};

	const listenToGame = () => {
		const { currentFloor, gameStatus } = GlobalStore.getFromGlobalStore("game").game;
		setFloor(currentFloor);
	};

	const listenToBattleItems = () => {
		setIsReady(checkIfItemsMax());
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("game", listenToGame);
		GlobalStore.AddListenerToVariable("battleItems", listenToBattleItems);
	}, []);

	return (
		<div className="flex flex-col gap-5 justify-center items-center">
			<H1>{`Floor ${floor}`}</H1>
			<Inventory size="medium" source="player" />
			<div className="flex gap-5">
				<div className="flex flex-col gap-4 border-2 border-slate-900 border-double p-4 rounded-lg">
					<H2>{"You"}</H2>
					<Health source="player" />
					<BattleItems source="player" />
				</div>
				<div className="flex flex-col gap-4 border-2 border-slate-900 border-double p-4 rounded-lg">
					<H2>{"Enemy"}</H2>
					<Health source="enemy" />
					<BattleItems source="enemy" disabled={true} />
				</div>
			</div>
			<Button disabled={!isReady} template="darker_inner" onClick={handleBattle} className={twMerge("font-bold block w-full", isReady ? "bg-green-500" : "bg-slate-500")}>
				FIGHT
			</Button>
		</div>
	);
};

export default Battle;
