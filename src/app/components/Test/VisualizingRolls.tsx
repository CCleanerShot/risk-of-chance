import React from "react";
import Utils from "@/common/utils/utils";
import UtilsGame from "@/common/utils/utils_game";

const VisualizingRolls = () => {
	return (
		<div className="grid grid-cols-4 gap-x-4">
			{Utils.MakeArray(100, (i) => i + 1).map((floor, index) => (
				<div key={`floor${index}`} className="flex">
					{/* <div className="text-green-600 w-10 grid place-items-center">{`F${floor}`}</div> */}
					{UtilsGame.CreateEnemyInventory(floor).map((numbers, index) =>
						numbers?.type === "dice" ? (
							<div key={index} className={`${numbers.sides === floor ? "text-blue-200" : "text-black"} grid place-items-center font-bold border w-8 h-7 text-sm`}>
								{numbers.sides}
							</div>
						) : (
							<div key={index}></div>
						)
					)}
				</div>
			))}
		</div>
	);
};

export default VisualizingRolls;
