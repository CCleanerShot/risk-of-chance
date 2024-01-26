"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import Utils from "@/common/utils/utils";
import UtilsGame from "@/common/utils/utils_game";
import { Health } from "@/types/game";
import { NPCTypes } from "@/types/local";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

interface LivesProps {
	source: NPCTypes;
}

const Lives = ({ source }: LivesProps) => {
	const [lives, setLives] = useState<Health>({ current: UtilsGame.health[source], max: UtilsGame.health[source] });

	const listenToLives = () => {
		const { current, max } = GlobalStore.getFromGlobalStore("lives").lives[source];
		setLives({ current, max });
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("lives", listenToLives);
	}, []);

	return (
		<div className="flex justify-center">
			{Utils.MakeArray(lives.max, (i) => i + 1).map((index) => {
				if (index <= lives.current) {
					return <IoMdHeart key={`health${index}`} size={40} color="pink" className="transition hover:scale-105" />;
				} else {
					return <IoMdHeartEmpty key={`health${index}`} size={40} color="pink" className="transition hover:scale-105" />;
				}
			})}
		</div>
	);
};

export default Lives;
