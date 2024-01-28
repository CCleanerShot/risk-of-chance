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
import { NPCTypes } from "@/types";

const Battle = () => {
	function checkIfItemsMax(): boolean {
		const array = GlobalStore.getFromGlobalStore("battleItems").battleItems.player;
		const arrayWithItems = array.filter((i) => i?.type);
		return arrayWithItems.length >= UtilsGame.maxStorage.battleItems.player;
	}

	const [isReady, setIsReady] = useState(checkIfItemsMax());
	const [helperHovered, setHelperHovered] = useState(false);
	const [battleResult, setBattleResult] = useState(GlobalStore.getFromGlobalStore("battleResult"));
	const [floor, setFloor] = useState(GlobalStore.getFromGlobalStore("game").game.currentFloor);
	const handleBattle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		UtilsGame.DoBattle();
	};

	const listenToGame = () => {
		const { currentFloor, gameStatus } = GlobalStore.getFromGlobalStore("game").game;
		setFloor(currentFloor);
	};

	const listenToBattleItems = () => {
		setIsReady(checkIfItemsMax());
	};

	const listenToBattleResult = () => {
		const { battleResult, items } = GlobalStore.getFromGlobalStore("battleResult");
		setBattleResult({ battleResult, items });
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("game", listenToGame);
		GlobalStore.AddListenerToVariable("battleItems", listenToBattleItems);
		GlobalStore.AddListenerToVariable("battleResult", listenToBattleResult);
	}, []);

	const handleHelperMouse = (input: boolean) => {
		setHelperHovered(input);
	};

	const BattleResultComponent = () => {
		switch (battleResult.battleResult) {
			case "draw":
				return <div className="text-slate-300">wow you guys drew</div>;
			case "lose":
				return <div className="text-red-500">you just lost lol</div>;
			case "win":
				return <div className="text-green-500">you just won that battle</div>;
			default:
				return (
					<div className="text-slate-300" onMouseEnter={() => handleHelperMouse(true)} onMouseLeave={() => handleHelperMouse(false)}>
						{helperHovered ? "why are you hovering me" : "choose your items"}
					</div>
				);
		}
	};

	console.log("test", battleResult.items.player);
	return (
		<div className="flex flex-col gap-5 justify-center items-center">
			<H1>{`Floor ${floor}`}</H1>
			<Inventory size="medium" source="player" />
			<div className="flex gap-5">
				<div className="flex gap-2 ">
					{battleResult.items.player.length > 0 && (
						<div className="flex p-2 border border-green-500 gap-1">
							{battleResult.items.player.map((number) => (
								<div>{number}</div>
							))}
						</div>
					)}
					<div className="flex flex-col gap-4 border-2 border-slate-900 border-double p-4 rounded-lg">
						<H2>{"You"}</H2>
						<Health source="player" />
						<BattleItems source="player" />
					</div>
				</div>
				<div className="flex gap-2">
					<div className="flex flex-col gap-4 border-2 border-slate-900 border-double p-4 rounded-lg">
						<H2>{"Enemy"}</H2>
						<Health source="enemy" />
						<BattleItems source="enemy" disabled={true} />
					</div>
					{battleResult.items.enemy.length > 0 && (
						<div className="flex p-2 border border-red-500 gap-2">
							{battleResult.items.enemy.map((number) => (
								<div>{number}</div>
							))}
						</div>
					)}
				</div>
			</div>
			<Button disabled={!isReady} template="darker_inner" onClick={handleBattle} className={twMerge("font-bold block w-full", isReady ? "bg-green-500" : "bg-slate-500")}>
				FIGHT
			</Button>
			<BattleResultComponent />
		</div>
	);
};

export default Battle;
