import { Dice, Inventory } from "@/types/game";
import Utils from "../utils/utils";

export default class UtilsGame {
	static MIN_DIFFICULTY = 9;
	static MAX_DIFFICULTY = 680;
	static MIN_FLOORS = 1;
	static MAX_FLOORS = 100;
	static slope = (UtilsGame.MAX_DIFFICULTY - UtilsGame.MIN_DIFFICULTY) / (UtilsGame.MAX_FLOORS - UtilsGame.MIN_FLOORS);
	static intercept = UtilsGame.MIN_DIFFICULTY / UtilsGame.slope;

	static generateEnemyInventory(lvl: number): Inventory | never {
		const inv: Inventory[number][] = [];
		const totalPool = Math.floor(UtilsGame.slope * lvl + UtilsGame.intercept);

		// have atleast 1 dice equal to the floor of the lvl
		inv.push(new Dice(lvl));

		// minimum amount of sides the other dice can be
		const remainingPool = totalPool - lvl;
		const min = Math.max(Math.floor((lvl / 3) * 2), 1);

		const itemSlotsLeft = 8;
		const randomNumbers = Utils.MakeArray(itemSlotsLeft, (i) => Utils.Random(min, lvl));
		const sum = randomNumbers.reduce((pV, cV) => pV + cV, 0);
		const randomWeights = randomNumbers.map((number) => number / sum);
		const finalNumbers = randomWeights.map((weight) => Math.min(Math.ceil(weight * remainingPool), lvl));

		console.log(
			lvl,
			remainingPool,
			finalNumbers.reduce((pV, cV) => pV + cV, 0)
		);

		inv.push(...finalNumbers.map((number) => new Dice(number)));
		return inv as Inventory;
	}
}