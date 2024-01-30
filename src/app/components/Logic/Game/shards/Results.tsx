"use client";

import GlobalStore from "@/common/global_store";
import { ResultsTypes } from "@/types";
import React, { useEffect, useState } from "react";
import Gold from "./Gold";
import Utils from "@/common/utils/utils";
import ItemContainer from "./ItemContainer";
import Inventory from "./Inventory";
import H1 from "@/app/components/UI/H1";
import Button from "@/app/components/UI/Button";
import UtilsGame from "@/common/utils/utils_game";

const Results = () => {
	const [game, setGame] = useState(GlobalStore.getFromStore("game").game);
	const [rewards, setRewards] = useState(GlobalStore.getFromStore("rewards").rewards);
	const [finalResults, setfinalResults] = useState<ResultsTypes>(GlobalStore.getFromStore("finalResults").finalResults);

	const listenToGame = () => {
		const newGame = GlobalStore.getFromStore("game").game;
		setGame(newGame);
	};

	const listenToRewards = () => {
		const newRewards = GlobalStore.getFromStore("rewards").rewards;
		setRewards(newRewards);
	};

	const listenToFinalResults = () => {
		const newfinalResults = GlobalStore.getFromStore("finalResults").finalResults;
		setfinalResults(newfinalResults);
	};

	useEffect(() => {
		GlobalStore.AddListener("finalResults", listenToFinalResults);
		GlobalStore.AddListener("game", listenToGame);
		GlobalStore.AddListener("rewards", listenToRewards);
		listenToFinalResults();
		listenToGame();
		listenToRewards();
	}, []);

	const handleContinue = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const { currentFloor, gameStatus } = GlobalStore.getFromStore("game").game;
		UtilsGame.StartFloor(currentFloor + 1, true);
	};

	const handleExit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		UtilsGame.ExitJourney();
	};

	const handleDie = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		UtilsGame.Die();
	};

	const WinComponent = () => (
		<div className="flex flex-col justify-center items-center gap-2">
			<div className="flex flex-col justify-center items-center">
				<Gold>{`+ ${Utils.FormatNumber(game.currentFloor)}`}</Gold>
				<H1>LOOT</H1>
				{rewards.map((reward, index) => (
					<ItemContainer size="medium" key={index} item={reward} source="rewards"></ItemContainer>
				))}
			</div>
			<div className="flex gap-2 justify-center items-start">
				<Inventory size="medium" source="player" />
			</div>
			<Button template="darker_inner" onClick={handleContinue}>
				CONTINUE
			</Button>
		</div>
	);

	const LoseComponent = () => <Button onClick={handleDie} template="standard" className="flex flex-col justify-center items-center border-red-500 text-red-500 hover:text-red-500">{`You lost :(`}</Button>;

	switch (finalResults) {
		case "draw":
			return (
				<Button onClick={handleExit} template="darker_inner">
					dunno what happened. you can go back :D.
				</Button>
			);
		case "lose":
			return LoseComponent();
		case "win":
			return WinComponent();
	}
};

export default Results;
