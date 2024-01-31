import React from "react";
import Button from "@/app/components/UI/Button";
import GlobalStore from "@/common/global_store";
import { GameStatusTypes } from "@/types";
import { twMerge } from "tailwind-merge";

interface BackProps {
	currentStatus: GameStatusTypes;
	className?: string;
}

const Back = ({ currentStatus, className }: BackProps) => {
	let clickEvent = () => {};
	let styles = "";
	let disabled;
	switch (currentStatus) {
		case "battle":
		case "exit":
		case "results":
		case "start":
			disabled = true;
			styles = "text-stale-700";
			break;
		case "shop":
			disabled = false;
			styles = "";
			clickEvent = () => GlobalStore.Update("game", "game", ({ currentFloor, gameStatus }) => ({ currentFloor, gameStatus: "start" }));
			break;
	}

	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		clickEvent();
	};

	return (
		<Button onClick={handleClick} template="green_border" disabled={disabled} className={twMerge(disabled ? "text-slate-800" : "", className)}>
			BACK
		</Button>
	);
};

export default Back;
