"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import Utils from "@/common/utils/utils";
import UtilsGame from "@/common/utils/utils_game";
import { ActorTypes, type Health } from "@/types";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

interface HealthProps {
    source: ActorTypes;
}

const Health = ({ source }: HealthProps) => {
    const [health, setHealth] = useState<Health>({ current: UtilsGame.maxHealth[source], max: UtilsGame.maxHealth[source] });

    const listenToHealth = () => {
        const { current, max } = GlobalStore.getFromStore("health").health[source];
        setHealth({ current, max });
    };

    useEffect(() => {
        GlobalStore.AddListener("health", listenToHealth);

        return () => {
            GlobalStore.RemoveListener("health", listenToHealth);
        };
    }, []);

    return (
        <div className="flex justify-center">
            {Utils.MakeArray(health.max, (i) => i + 1).map((index) => {
                if (index <= health.current) {
                    return <IoMdHeart key={`health${index}`} size={40} color="pink" className="transition hover:scale-105" />;
                } else {
                    return <IoMdHeartEmpty key={`health${index}`} size={40} color="pink" className="transition hover:scale-105" />;
                }
            })}
        </div>
    );
};

export default Health;
