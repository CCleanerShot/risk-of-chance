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
					<ItemContainer size="medium" key={index} item={reward} source="rewards"></ItemContainer>
				))}
			</div>
			<Inventory size="medium" source="player" />
			{finalResults}
		</div>
	);
};

export default Results;
