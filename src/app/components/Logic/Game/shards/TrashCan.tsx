"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import { Item, SizeTypes } from "@/types";
import ItemContainer from "./ItemContainer";

interface TrashCanProps {
    size: SizeTypes;
}

const TrashCan = ({ size }: TrashCanProps) => {
    const [trashCan, setTrashCan] = useState<Item[]>(GlobalStore.getFromStore("trashCan").trashCan);

    const listenToTrashCan = () => {
        const newTrashCan = GlobalStore.getFromStore("trashCan").trashCan;
        setTrashCan(newTrashCan);
    };

    useEffect(() => {
        GlobalStore.AddListener("trashCan", listenToTrashCan);
        listenToTrashCan();

        return () => {
            GlobalStore.RemoveListener("trashCan", listenToTrashCan);
            GlobalStore.Update("trashCan", "trashCan", []);
        };
    }, []);

    return (
        <div className="">
            {trashCan.length > 0 && trashCan.map((item, i) => <ItemContainer key={`trashcan${i}`} item={item} size={size} source="trashCan" />)}
            {trashCan.length < 1 && <ItemContainer item={null} size={size} source="trashCan" />}
        </div>
    );
};

export default TrashCan;
