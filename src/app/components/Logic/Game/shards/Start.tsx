import React from "react";
import Backpack from "./Backpack";
import Inventory from "./Inventory";
import Floors from "./Floors";
import Button from "@/app/components/UI/Button";
import GlobalStore from "@/common/global_store";

const Start = () => {
	const handleEnterShop = () => {
		GlobalStore.Update("game", "game", ({ currentFloor, gameStatus }) => ({ currentFloor, gameStatus: "shop" }));
	};

	return (
		<div className="flex-1 flex justify-around gap-2">
			<div className="flex gap-2">
				<div className="flex flex-col gap-2">
					<Backpack size="smallest" source="player" />
				</div>
				<div className="flex flex-col gap-2">
					<Inventory size="small" source="player" />
					<Button onClick={handleEnterShop} template="darker_inner">
						ENTER SHOP
					</Button>
				</div>
			</div>
			<Floors />
		</div>
	);
};

export default Start;
