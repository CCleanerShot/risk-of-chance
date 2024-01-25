"use client";
import Button from "@/app/components/UI/Button";
import GlobalStore from "@/common/global_store";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

// TODO: refactor from 100 different buttons listening on everything, to a radio-like system where only the submit button knows

interface LevelButtonProps {
	level: number;
}

const LevelButton = ({ level }: LevelButtonProps) => {
	const [isSelected, setIsSelected] = useState(false);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const level = Number(e.currentTarget.textContent);

		if (isNaN(level)) {
			GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: "Level select error! Please notify the dev!", type: "error" });
			return;
		}

		GlobalStore.UpdateVariableProperty("viewSelected", "levelSelect", level);
	};

	const listenToViewSelected = () => {
		const { itemSelect, levelSelect } = GlobalStore.getFromGlobalStore("viewSelected");
		setIsSelected(level === levelSelect);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("viewSelected", listenToViewSelected);
	}, []);

	return (
		<Button template="green_border" className={twMerge(" text-white border border-slate-900 p-1", isSelected ? "text-green-500" : "")} onClick={handleClick}>
			{level}
		</Button>
	);
};

export default LevelButton;
