"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import { Item } from "@/types";
import H1 from "@/app/components/UI/H1";
import ItemContainer from "./ItemContainer";
import Button from "@/app/components/UI/Button";
import UtilsGame from "@/common/utils/utils_game";
import Gold from "./Gold";
import Utils from "@/common/utils/utils";
import Backpack from "./Backpack";
import TrashCan from "./TrashCan";

const Shop = () => {
	const [shop, setShop] = useState(GlobalStore.getFromStore("shop").shop);
	const [trashCan, setTrashCan] = useState(GlobalStore.getFromStore("trashCan").trashCan);
	const isDisabled = trashCan.length < 1;

	const listenToTrashCan = () => {
		const newTrashCan = GlobalStore.getFromStore("trashCan").trashCan;
		setTrashCan(newTrashCan);
	};

	const listenToShop = () => {
		const newShop = GlobalStore.getFromStore("shop").shop;
		setShop(newShop);
	};

	const handleSell = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		UtilsGame.SellItem(trashCan[0], (trashCan[0] as Item<"dice">).sides);
	};

	useEffect(() => {
		GlobalStore.AddListener("shop", listenToShop);
		GlobalStore.AddListener("trashCan", listenToTrashCan);
		listenToShop();
		listenToTrashCan();
	}, []);

	return (
		<div className="flex gap-2">
			<Backpack size="smallest" source="player" />
			<div className="flex flex-col gap-2">
				<H1>THE SHOP</H1>
				{shop.map((item, index) => (
					<div key={`item${index}`} className="flex">
						<div className="flex justify-center items-center gap-2">
							<ItemContainer item={item} size="small" source="shop" overrideOnClick={() => UtilsGame.BuyItem(item, item?.cost)} />
							{item?.type && (
								<div className="flex justify-start item-start">
									<Gold>{Utils.FormatNumber(item.cost)}</Gold>
								</div>
							)}
						</div>
					</div>
				))}
				<div className="grid place-items-center gap-2">
					<Button template="darker_inner" disabled={isDisabled} onClick={handleSell} className={isDisabled ? "text-slate-900" : ""}>
						SELL ITEM
					</Button>
					<TrashCan size="small" />
				</div>
			</div>
		</div>
	);
};

export default Shop;
