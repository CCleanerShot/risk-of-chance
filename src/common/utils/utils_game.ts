import { Dice, Item } from "@/types/game";
import Utils from "../utils/utils";
import GlobalStore from "../global_store";
import { StorageTypes } from "@/types";

export default class UtilsGame {
	static MAX_ENEMY_LIFE = 2;
	static MAX_PLAYER_LIFE = 2;
	static MIN_DIFFICULTY = 9;
	static MAX_DIFFICULTY = 680;
	static MIN_FLOORS = 1;
	static MAX_FLOORS = 100;
	static MAX_BACKPACK_SIZE = 100;
	static MAX_INVENTORY_SIZE = 9;
	static MAX_BATTLE_ITEMS_SIZE = 3;
	static slope = (UtilsGame.MAX_DIFFICULTY - UtilsGame.MIN_DIFFICULTY) / (UtilsGame.MAX_FLOORS - UtilsGame.MIN_FLOORS);
	static intercept = UtilsGame.MIN_DIFFICULTY / UtilsGame.slope;

	static createEnemyInventory(lvl: number): Item[] {
		const inv: Item[] = [];
		const totalPool = Math.floor(UtilsGame.slope * lvl + UtilsGame.intercept);

		// have atleast 1 dice equal to the floor of the lvl
		inv.push(new Dice(lvl));

		// minimum amount of sides the other dice can be
		const remainingPool = totalPool - lvl;
		const min = Math.max(Math.floor((lvl / 3) * 2), 1);

		const itemSlotsLeft = UtilsGame.MAX_INVENTORY_SIZE - 1;
		const randomNumbers = Utils.MakeArray(itemSlotsLeft, (i) => Utils.Random(min, lvl));
		const sum = randomNumbers.reduce((pV, cV) => pV + cV, 0);
		const randomWeights = randomNumbers.map((number) => number / sum);
		const finalNumbers = randomWeights.map((weight) => Math.min(Math.ceil(weight * remainingPool), lvl));

		inv.push(...finalNumbers.map((number) => new Dice(number)));
		return inv as Item[];
	}

	static generateFloor(lvl: number) {
		// TODO: add more cool things to a lvl
		const enemyInventory = UtilsGame.createEnemyInventory(lvl);
		GlobalStore.UpdateVariableProperty("game", "game", { currentFloor: lvl, gameStatus: { type: "battle", turn: "player", enemyInventory: enemyInventory } });
	}

	static MoveItem(item: Item, source: StorageTypes, destination: StorageTypes) {}
}
