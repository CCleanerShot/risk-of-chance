"use client";

import React, { useEffect, useState } from "react";
import Inventory from "./Inventory";
import BattleItems from "./BattleItems";
import Button from "@/app/components/UI/Button";
import GlobalStore from "@/common/global_store";
import Lives from "./Lives";
import H1 from "@/app/components/UI/H1";
import H2 from "@/app/components/UI/H2";

const Battle = () => {
	const [floor, setFloor] = useState(GlobalStore.getFromGlobalStore("game").game.currentFloor);

	const handleBattle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {};

	const listenToGame = () => {
		const { currentFloor, gameStatus } = GlobalStore.getFromGlobalStore("game").game;
		setFloor(currentFloor);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("game", listenToGame);
	}, []);

	return (
		<div className="flex flex-col gap-5 justify-center items-center">
			<H1>{`Floor ${floor}`}</H1>
			<Inventory size="medium" />
			<div className="flex gap-5">
				<div className="flex flex-col gap-4 border-2 border-slate-900 border-double p-4 rounded-lg">
					<H2>{"You"}</H2>
					<Lives source="player" />
					<BattleItems source="player" />
				</div>
				<div className="flex flex-col gap-4 border-2 border-slate-900 border-double p-4 rounded-lg">
					<H2>{"Enemy"}</H2>
					<Lives source="enemy" />
					<BattleItems source="enemy" disabled={true} />
				</div>
			</div>
			<Button template="darker_inner" onClick={handleBattle} className="font-bold block w-full">
				FIGHT
			</Button>
		</div>
	);
};

export default Battle;
