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
import { twMerge } from "tailwind-merge";

const Shop = () => {
    const [shop, setShop] = useState(GlobalStore.getFromStore("shop").shop);
    const [trashCan, setTrashCan] = useState(GlobalStore.getFromStore("trashCan").trashCan);
    const [upgradePeeker, setUpgradePeeker] = useState(GlobalStore.getFromStore("upgradePeeker").amount);
    const [upgradeStarter, setUpgradeStarter] = useState(GlobalStore.getFromStore("upgradeStarter").amount);
    const [upgradeStarterHovered, setUpgradeStarterHovered] = useState(false);
    const [upgradePeekerHovered, setUpgradePeekerHovered] = useState(false);

    const isDisabled = trashCan.length < 1;
    const costs = {
        upgradeStarter: 20 * Math.pow(10, upgradeStarter),
        upgradePeeker: 50 * Math.pow(10, upgradePeeker),
    };

    const listenToTrashCan = () => {
        const newTrashCan = GlobalStore.getFromStore("trashCan").trashCan;
        setTrashCan(newTrashCan);
    };

    const listenToShop = () => {
        const newShop = GlobalStore.getFromStore("shop").shop;
        setShop(newShop);
    };

    const listenToUpgradeStarter = () => {
        const newUpgradeStarter = GlobalStore.getFromStore("upgradeStarter").amount;
        setUpgradeStarter(newUpgradeStarter);
    };

    const listenToUpgradePeeker = () => {
        const newUpgradePeeker = GlobalStore.getFromStore("upgradePeeker").amount;
        setUpgradePeeker(newUpgradePeeker);
    };

    const handleSell = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        UtilsGame.SellItem(trashCan[0], (trashCan[0] as Item<"dice">).sides);
    };

    const handleUpgrade = (upgrade: "upgradeStarter" | "upgradePeeker") => {
        UtilsGame.BuyUpgrade(upgrade, costs[upgrade]);
    };

    useEffect(() => {
        GlobalStore.AddListener("shop", listenToShop);
        GlobalStore.AddListener("trashCan", listenToTrashCan);
        GlobalStore.AddListener("upgradePeeker", listenToUpgradePeeker);
        GlobalStore.AddListener("upgradeStarter", listenToUpgradeStarter);

        listenToShop();
        listenToTrashCan();

        return () => {
            GlobalStore.RemoveListener("shop", listenToShop);
            GlobalStore.RemoveListener("trashCan", listenToTrashCan);
            GlobalStore.RemoveListener("upgradePeeker", listenToUpgradePeeker);
            GlobalStore.RemoveListener("upgradeStarter", listenToUpgradeStarter);
        };
    }, []);

    return (
        <div className="flex gap-2">
            <div className="flex flex-col">
                <Backpack size="smallest" source="player" />
                <div className="grid place-items-center gap-2">
                    <Button template="darker_inner" disabled={isDisabled} onClick={handleSell} className={isDisabled ? "text-slate-900" : ""}>
                        SELL ITEM
                    </Button>
                    <TrashCan size="small" />
                </div>
            </div>
            <div className="flex flex-col gap-2 items-start">
                <div className="flex gap-8">
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
                    <div className="flex flex-col gap-1">
                        <H1>THE SMITH</H1>
                        <div className="flex flex-col items-start gap-1">
                            <em className={twMerge("transition text-xs", upgradeStarterHovered ? "text-gray-100" : "text-gray-500")}>better starter gear</em>
                            <div className="flex gap-2">
                                <Button className="min-w-28 text-center" template="green_border" onClick={() => handleUpgrade("upgradeStarter")} onMouseEnter={() => setUpgradeStarterHovered(true)} onMouseLeave={() => setUpgradeStarterHovered(false)}>
                                    +STARTER
                                </Button>
                                <Gold className="flex-1">{Utils.FormatNumber(costs["upgradeStarter"])}</Gold>
                            </div>
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <em className={twMerge("transition text-xs", upgradePeekerHovered ? "text-gray-100" : "text-gray-500")}>+1 viewable rewards</em>
                            <div className="flex gap-2">
                                <Button className="min-w-28 text-center" template="green_border" onClick={() => handleUpgrade("upgradePeeker")} onMouseEnter={() => setUpgradePeekerHovered(true)} onMouseLeave={() => setUpgradePeekerHovered(false)}>
                                    +PEEK
                                </Button>
                                <Gold className="flex-1">{Utils.FormatNumber(costs["upgradePeeker"])}</Gold>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
