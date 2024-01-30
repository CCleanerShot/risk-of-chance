import React from "react";
import Button from "@/app/components/UI/Button";
import UtilsGame from "@/common/utils/utils_game";
import GlobalStore from "@/common/global_store";

const Exit = () => {
	const handleExit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		UtilsGame.ExitJourney();
	};

	const handleContinue = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const { currentFloor, gameStatus } = GlobalStore.getFromStore("game").game;
		UtilsGame.StartFloor(currentFloor + 1, false);
	};

	return (
		<div className="flex flex-col gap-2">
			<div>you found an exit! leave to go home, or continue to venture on</div>
			<Button onClick={handleExit} template="darker_inner">
				LEAVE
			</Button>
			<Button onClick={handleContinue} template="darker_inner">
				CONTINUE
			</Button>
		</div>
	);
};

export default Exit;
