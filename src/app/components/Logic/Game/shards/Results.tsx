"use client";

import GlobalStore from "@/common/global_store";
import { ResultsTypes } from "@/types";
import React, { useEffect, useState } from "react";
import Gold from "./Gold";
import Utils from "@/common/utils/utils";
import ItemContainer from "./ItemContainer";
import Inventory from "./Inventory";
import H1 from "@/app/components/UI/H1";

const Results = () => {
	const [game, setGame] = useState(GlobalStore.getFromGlobalStore("game").game);
	const [rewards, setRewards] = useState(GlobalStore.getFromGlobalStore("rewards").rewards);
	const [finalResults, setfinalResults] = useState<ResultsTypes>(GlobalStore.getFromGlobalStore("finalResults").finalResults);

	const listenToGame = () => {
		const newGame = GlobalStore.getFromGlobalStore("game").game;
		setGame(newGame);
	};

	const listenToRewards = () => {
		const newRewards = GlobalStore.getFromGlobalStore("rewards").rewards;
		setRewards(newRewards);
	};

	const listenToFinalResults = () => {
		const newfinalResults = GlobalStore.getFromGlobalStore("finalResults").finalResults;
		setfinalResults(newfinalResults);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("finalResults", listenToFinalResults);
		GlobalStore.AddListenerToVariable("game", listenToGame);
		GlobalStore.AddListenerToVariable("rewards", listenToRewards);
		listenToFinalResults();
		listenToGame();
		listenToRewards();
	}, []);

	return (
		<div className="flex flex-col justify-center items-center">
			<div className="flex flex-col justify-center items-center">
				<H1>GET</H1>
				<Gold>{`+ ${Utils.FormatNumber(game.currentFloor)}`}</Gold>
				{rewards.map((reward, index) => (
					<ItemContainer size="medium" key={index} item={reward} origin="rewards"></ItemContainer>
				))}
			</div>
			<Inventory size="medium" source="player" />
			{finalResults}
		</div>
	);
};

export default Results;
