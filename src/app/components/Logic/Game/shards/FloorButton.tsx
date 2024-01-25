"use client";
import Button from "@/app/components/UI/Button";
import GlobalStore from "@/common/global_store";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

// TODO: refactor from 100 different buttons listening on everything, to a radio-like system where only the submit button knows

interface FloorButtonProps {
	floor: number;
}

const FloorButton = ({ floor }: FloorButtonProps) => {
	const [isSelected, setIsSelected] = useState(false);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const floor = Number(e.currentTarget.textContent);

		if (isNaN(floor)) {
			GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: "Floor select error! Please notify the dev!", type: "error" });
			return;
		}

		GlobalStore.UpdateVariableProperty("viewSelected", "floorSelect", floor);
	};

	const listenToViewSelected = () => {
		const { itemSelect, floorSelect } = GlobalStore.getFromGlobalStore("viewSelected");
		setIsSelected(floor === floorSelect);
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("viewSelected", listenToViewSelected);
	}, []);

	return (
		<Button template="green_border" className={twMerge(" text-white border border-slate-900 p-1", isSelected ? "text-green-600" : "")} onClick={handleClick}>
			{floor}
		</Button>
	);
};

export default FloorButton;
