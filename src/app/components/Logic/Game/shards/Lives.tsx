import GlobalStore from "@/common/global_store";
import Utils from "@/common/utils/utils";
import UtilsGame from "@/common/utils/utils_game";
import { Health } from "@/types/game";
import React, { useEffect, useState } from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

const Lives = () => {
	const [lives, setLives] = useState<Health>({ current: UtilsGame.MAX_LIFE, max: UtilsGame.MAX_LIFE });

	const listenToLives = () => {
		const { current, max } = GlobalStore.getFromGlobalStore("lives").lives;
		setLives({ current, max });
	};

	useEffect(() => {
		GlobalStore.AddListenerToVariable("lives", listenToLives);
	}, []);

	return (
		<div className="flex justify-center">
			{Utils.MakeArray(lives.max, (i) => i + 1).map((index) => {
				if (index <= lives.current) {
					return <IoMdHeart size={40} color="pink" className="transition hover:scale-105" />;
				} else {
					return <IoMdHeartEmpty size={40} color="pink" className="transition hover:scale-105" />;
				}
			})}
		</div>
	);
};

export default Lives;
