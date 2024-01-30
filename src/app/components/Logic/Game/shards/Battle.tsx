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
import { ActorTypes } from "@/types";
import Utils from "@/common/utils/utils";

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
		const { battleResult, rolls } = GlobalStore.getFromGlobalStore("battleResult");
		setBattleResult({ battleResult, rolls });
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

	const NPCLogsComponent = ({ source, className }: { source: ActorTypes; className?: string }) =>
		battleResult.rolls[source].length ? (
			<div className={twMerge("p-2 gap-2 justify-start place-items-start grid auto-rows-min", className)} style={{ gridTemplateColumns: `repeat(${UtilsGame.maxStorage.battleItems[source]}, minmax(0, 1fr))` }}>
				{battleResult.rolls[source].map((number, index) => (
					<div key={`logs${index}`} className="border flex justify-center items-center min-w-10 min-h-10">
						<div className="text-sm">{`${number.value}`}</div>
						<div>/</div>
						<div className="text-sm">{`${number.item.sides}`}</div>
					</div>
				))}
			</div>
		) : (
			<></>
		);

	const NPCMainComponent = ({ source, className, disabled }: { source: ActorTypes; className?: string; disabled: boolean }) => (
		<div className="flex flex-col gap-4 border-2 border-slate-900 border-double p-4 rounded-lg">
			<H2>{Utils.FirstLetterUppercase(source)}</H2>
			<Health source={source} />
			<BattleItems size="medium" source={source} disabled={disabled} />
		</div>
	);

	return (
		<div className="flex flex-col gap-5 justify-center items-center">
			<H1>{`Floor ${floor}`}</H1>
			<Inventory size="medium" source="player" />
			<div className="flex gap-5">
				<div className="flex gap-2 ">
					{NPCLogsComponent({ source: "player", className: "border border-green-500" })}
					{NPCMainComponent({ disabled: false, source: "player", className: "border border-green-500" })}
				</div>
				<div className="flex gap-2">
					{NPCMainComponent({ disabled: true, source: "enemy", className: "border border-red-500" })}
					{NPCLogsComponent({ source: "enemy", className: "border border-red-500" })}
				</div>
			</div>
			<Button disabled={!isReady} template="darker_inner" onClick={handleBattle} className={twMerge("font-bold block w-full", isReady ? "bg-green-500" : "bg-slate-500")}>
				FIGHT
			</Button>
			{BattleResultComponent()}
		</div>
	);
};

export default Battle;
