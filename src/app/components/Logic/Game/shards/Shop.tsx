"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import { PurchaseableItem } from "@/types";
import H1 from "@/app/components/UI/H1";
import ItemContainer from "./ItemContainer";
import Button from "@/app/components/UI/Button";
import UtilsGame from "@/common/utils/utils_game";
import Gold from "./Gold";
import Utils from "@/common/utils/utils";
import Backpack from "./Backpack";

const Shop = () => {
	const [shop, setShop] = useState<PurchaseableItem[]>(GlobalStore.getFromStore("shop").shop);

	const listenToShop = () => {
		const newShop = GlobalStore.getFromStore("shop").shop;
		setShop(newShop);
	};

	useEffect(() => {
		GlobalStore.AddListener("shop", listenToShop);
		listenToShop();
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
			</div>
		</div>
	);
};

export default Shop;
