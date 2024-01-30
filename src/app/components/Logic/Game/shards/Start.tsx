import React from "react";
import Backpack from "./Backpack";
import Inventory from "./Inventory";
import Floors from "./Floors";
import Trashcan from "./Trashcan";
import GoldTotal from "./GoldTotal";

const Start = () => {
	return (
		<div className="flex-1 flex justify-around">
			<div className="flex gap-2">
				<div className="flex flex-col gap-2">
					<Backpack size="smallest" source="player" />
					<div className="flex justify-between items-center">
						<GoldTotal />
						<Trashcan size="smallest" />
					</div>
				</div>
				<Inventory size="small" source="player" />
			</div>
			<Floors />
		</div>
	);
};

export default Start;
