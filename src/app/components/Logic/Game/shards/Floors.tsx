import React from "react";
import Utils from "@/common/utils/utils";
import UtilsGame from "@/common/utils/utils_game";
import GlobalStore from "@/common/global_store";
import FloorButton from "./FloorButton";
import Button from "@/app/components/UI/Button";
import H1 from "@/app/components/UI/H1";

const Floors = () => {
	const handleStart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const { itemSelect, floorSelect } = GlobalStore.getFromGlobalStore("viewSelected");
		UtilsGame.StartBattleCycle(floorSelect);
	};

	return (
		<div>
			<H1>Floor Select</H1>
			<div className="grid grid-cols-10 gap-1 mb-1">
				{Utils.MakeArray(UtilsGame.MAX_FLOORS, (i) => i + 1).map((index) => (
					<FloorButton key={`floor${index}`} floor={index} />
				))}
			</div>
			<Button template="darker_inner" className="font-bold block w-full" onClick={handleStart}>
				START
			</Button>
		</div>
	);
};

export default Floors;
