import React, { useState } from "react";
import Utils from "@/common/utils/utils";
import UtilsGame from "@/common/utils/utils_game";
import GlobalStore from "@/common/global_store";
import LevelButton from "./LevelButton";
import Button from "@/app/components/UI/Button";
import H1 from "@/app/components/UI/H1";

const Levels = () => {
	const [selectedLevel, setSelectedLevel] = useState(1);

	const handleStart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const { currentLevel, gameStatus, player } = GlobalStore.getFromGlobalStore("game").game;
		GlobalStore.UpdateVariableProperty("game", "game", { currentLevel: selectedLevel, gameStatus: { type: "battle", turn: "player" }, player });
	};

	return (
		<div>
			<H1>Level Select</H1>
			<div className="grid grid-cols-10 gap-1 mb-1">
				{Utils.MakeArray(UtilsGame.MAX_FLOORS, (i) => i + 1).map((index) => (
					<LevelButton key={`level${index}`} level={index} />
				))}
			</div>
			<div className="flex">
				<Button template="darker_inner" className="flex-1" onClick={handleStart}>
					Start
				</Button>
			</div>
		</div>
	);
};

export default Levels;
