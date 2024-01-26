import React from "react";
import Utils from "@/common/utils/utils";
import UtilsGame from "@/common/utils/utils_game";

const VisualizingRolls = () => {
	return (
		<div>
			{Utils.MakeArray(100, (i) => i + 1).map((floor) => (
				<div className="flex">
					<div className="text-green-600">{`Floor ${floor}`}</div>
					{UtilsGame.CreateEnemyInventory(floor).map((numbers) => (
						<div className="border p-1 text-sm">{numbers?.sides}</div>
					))}
				</div>
			))}
		</div>
	);
};

export default VisualizingRolls;
