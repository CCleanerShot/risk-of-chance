import { Item } from "@/types/game";
import Utils from "../utils/utils";
import GlobalStore from "../global_store";
import { StorageTypes } from "@/types";
import { NPCTypes, ResultsTypes } from "@/types/local";

export default class UtilsGame {
	static MIN_DIFFICULTY = 9;
	static MAX_DIFFICULTY = 680;
	static MIN_FLOORS = 1;
	static MAX_FLOORS = 100;
	static FLOOR_TO_SWITCH_FORMULA = 5;
	static formulas = {
		1: () => {
			const slope = (UtilsGame.MAX_DIFFICULTY - UtilsGame.MIN_DIFFICULTY) / (UtilsGame.MAX_FLOORS - UtilsGame.MIN_FLOORS);
			const intercept = UtilsGame.MIN_DIFFICULTY / slope;
			return { slope, intercept };
		},
		2: () => {
			const slope = 3;
			const intercept = 7;
			return { slope, intercept };
		},
	};

	static maxHealth = {
		player: 2,
		enemy: 2,
	};

	static maxStorage = {
		backpack: {
			player: 100,
			enemy: 100,
		},

		inventory: {
			player: 12,
			enemy: 9,
		},

		battleItems: {
			player: 3,
			enemy: 3,
		},
	};

	static STARTING_INVENTORY: Item[] = [
		{ type: "dice", sides: 1, disabled: false },
		{ type: "dice", sides: 1, disabled: false },
		{ type: "dice", sides: 1, disabled: false },
		{ type: "dice", sides: 2, disabled: false },
		{ type: "dice", sides: 2, disabled: false },
		{ type: "dice", sides: 2, disabled: false },
		{ type: "dice", sides: 3, disabled: false },
		{ type: "dice", sides: 3, disabled: false },
		{ type: "dice", sides: 3, disabled: false },
	] as const;

	static CreateEnemyInventory(floor: number): Item[] {
		const inv: Item[] = [];
		let interceptAndSlope;

		if (floor > UtilsGame.FLOOR_TO_SWITCH_FORMULA) {
			interceptAndSlope = UtilsGame.formulas[1]();
		} else {
			interceptAndSlope = UtilsGame.formulas[2]();
		}

		const { intercept, slope } = interceptAndSlope;
		const totalPool = Math.floor(slope * floor + intercept);

		// have atleast 1 dice equal to the floor of the floor
		inv.push({ type: "dice", sides: floor, disabled: false });

		// minimum amount of sides the other dice can be
		const remainingPool = totalPool - floor;
		const min = Math.max(Math.floor((floor / 3) * 2), 1);

		const itemSlotsLeft = UtilsGame.maxStorage.inventory["enemy"] - 1;
		const randomNumbers = Utils.MakeArray(itemSlotsLeft, (i) => Utils.Random(min, floor));
		const sum = randomNumbers.reduce((pV, cV) => pV + cV, 0);
		const randomWeights = randomNumbers.map((number) => number / sum);
		const finalNumbers = randomWeights.map((weight) => Math.min(Math.round(weight * remainingPool), floor));

		inv.push(...finalNumbers.map((number) => ({ type: "dice", sides: number } as Item)));

		return inv as Item[];
	}

	static ReturnRandomBattleItems(items: Item[], source: NPCTypes) {
		function nextItem(index: number, array: Item[]) {
			const currentItem = array[index];
			const isDisabled = currentItem?.disabled;
			const isNull = currentItem === null;
			const isLastItem = index === array.length - 1;

			if ((isDisabled || isNull) && !isLastItem) {
				return nextItem(index + 1, shuffled);
			}

			if (!isDisabled && !isNull) {
				return currentItem;
			} else {
				return null;
			}
		}

		const shuffled = Utils.ShuffleArray(items);
		return Utils.MakeArray(UtilsGame.maxStorage.battleItems[source], (index) => nextItem(index, shuffled));
	}

	static GenerateFloor(floor: number) {
		// TODO: add more cool things to a floor
		let inventory: (Item | null)[] = UtilsGame.CreateEnemyInventory(floor) as Item[];
		const items = UtilsGame.ReturnRandomBattleItems(inventory as Item[], "enemy");
		inventory = inventory.map((i) => (items.includes(i) ? null : i));

		GlobalStore.UpdateVariableProperty("inventory", "inventory", ({ enemy, player }) => ({ enemy: inventory, player: player }));
		GlobalStore.UpdateVariableProperty("battleItems", "battleItems", ({ enemy, player }) => ({ enemy: items, player: player }));
		GlobalStore.UpdateVariableProperty("game", "game", { currentFloor: floor, gameStatus: { type: "battle" } });
	}

	static StartBattleCycle(floor: number) {
		const { enemy, player } = GlobalStore.getFromGlobalStore("inventory").inventory;

		if (!player.length) {
			// TODO: remove this notification from the toast lol
			GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: "Giving starter items...", type: "log" });
			GlobalStore.UpdateVariableProperty("inventory", "inventory", { enemy, player: [...UtilsGame.STARTING_INVENTORY] });
		}

		UtilsGame.GenerateFloor(floor);
	}

	static GetStorage(type: StorageTypes, owner: NPCTypes) {
		switch (type) {
			case "backpack":
				return GlobalStore.getFromGlobalStore("backpack").backpack;
			case "battleItems":
				return GlobalStore.getFromGlobalStore("battleItems").battleItems[owner];
			case "inventory":
				return GlobalStore.getFromGlobalStore("inventory").inventory[owner];
		}
	}

	static MoveItem(actor: NPCTypes, item: Item, source: StorageTypes, destination: StorageTypes) {
		const storageSource = UtilsGame.GetStorage(source, actor);
		const storageDestination = UtilsGame.GetStorage(destination, actor);

		const foundSourceIndex = storageSource.findIndex((i) => i === item);
		const amountOfItems = storageDestination.filter((i) => i?.type);

		if (amountOfItems.length >= UtilsGame.maxStorage[destination][actor]) {
			GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: `Cannot move: max capacity reached for ${destination}`, type: "warn" });
			return;
		}

		if (foundSourceIndex === -1) {
			GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: `Cannot move: original item is missing`, type: "error" });
			return;
		}

		storageSource[foundSourceIndex] = null;

		const foundDestinationNullIndex = storageDestination.findIndex((i) => i === null);
		if (foundDestinationNullIndex === -1) {
			storageDestination.push(item); // in the case that the array didnt contain null values
		} else {
			storageDestination[foundDestinationNullIndex] = item; // in the case that the array contained null values
		}

		GlobalStore.UpdateVariableProperty("backpack", "backpack", (backpack) => [...backpack]);
		GlobalStore.UpdateVariableProperty("inventory", "inventory", (inventory) => ({ ...inventory }));
		GlobalStore.UpdateVariableProperty("battleItems", "battleItems", (battleItems) => ({ ...battleItems }));
	}

	static DoBattle() {
		function GetDiceRollsAndTotal(items: Item<"dice">[]) {
			const rolls = items.map((item) => ({ item: item, value: Math.round(Utils.Random(1, item.sides)) }));
			const total = rolls.reduce((pV, cV) => pV + cV.value, 0);
			return { rolls: rolls, total: total };
		}

		function updateBattleAndState() {
			const { enemy, player } = GlobalStore.getFromGlobalStore("inventory").inventory;
			enemyDices.forEach((item) => (item!.disabled = true));
			playerDices.forEach((item) => (item!.disabled = true));
			playerDices.forEach((item) => UtilsGame.MoveItem("player", item, "battleItems", "inventory"));
			enemyDices.forEach((item) => UtilsGame.MoveItem("enemy", item, "battleItems", "inventory"));
			const newBattleItems = UtilsGame.ReturnRandomBattleItems(enemy, "enemy");
			GlobalStore.UpdateVariableProperty("inventory", "inventory", (inv) => inv);
			GlobalStore.UpdateVariableProperty("battleItems", "battleItems", (items) => ({ enemy: newBattleItems, player: items.player }));
		}

		const { enemy, player } = GlobalStore.getFromGlobalStore("battleItems").battleItems;
		const enemyDices = enemy.filter((item) => item?.type === "dice") as Item<"dice">[];
		const playerDices = player.filter((item) => item?.type === "dice") as Item<"dice">[];
		const enemyResults = GetDiceRollsAndTotal(enemyDices);
		const playerResults = GetDiceRollsAndTotal(playerDices);
		switch (true) {
			case enemyResults.total === playerResults.total:
				GlobalStore.UpdateVariableProperty("battleResult", "battleResult", "draw");
				break;

			case enemyResults.total < playerResults.total: {
				const newHealth = Math.max(0, GlobalStore.getFromGlobalStore("health").health["enemy"].current - 1);
				if (newHealth === 0) {
					UtilsGame.EndBattle("win");
				} else {
					GlobalStore.UpdateVariableProperty("battleResult", "battleResult", "win");
					GlobalStore.UpdateVariableProperty("battleResult", "rolls", { enemy: enemyResults.rolls, player: playerResults.rolls });
					GlobalStore.UpdateVariableProperty("health", "health", ({ enemy, player }) => ({ enemy: { current: Math.max(0, enemy.current - 1), max: enemy.max }, player: player }));
					updateBattleAndState();
				}

				break;
			}

			case enemyResults.total > playerResults.total: {
				const newHealth = Math.max(0, GlobalStore.getFromGlobalStore("health").health["player"].current - 1);
				if (newHealth === 0) {
					UtilsGame.EndBattle("lose");
				} else {
					GlobalStore.UpdateVariableProperty("battleResult", "battleResult", "lose");
					GlobalStore.UpdateVariableProperty("battleResult", "rolls", { enemy: enemyResults.rolls, player: playerResults.rolls });
					GlobalStore.UpdateVariableProperty("health", "health", ({ enemy, player }) => ({ enemy: enemy, player: { current: Math.max(0, player.current - 1), max: player.max } }));
					updateBattleAndState();
				}

				break;
			}
		}
	}

	static GenerateLoot(items: Item[], floor: number, roll: number): Item[] {
		const result = Math.random() * roll;

		if (result < 0.5) {
			return items;
		}

		items.push({ disabled: false, sides: floor, type: "dice" } as Item<"dice">);
		return UtilsGame.GenerateLoot(items, floor, result);
	}

	static EndBattle(result: ResultsTypes) {
		const { currentFloor, gameStatus } = GlobalStore.getFromGlobalStore("game").game;
		const lootTable = GlobalStore.UpdateVariableProperty("finalResults", "finalResults", result);
		GlobalStore.UpdateVariableProperty("rewards", "rewards", (pV) => []);
		GlobalStore.UpdateVariableProperty("game", "game", ({ currentFloor, gameStatus }) => ({ currentFloor: currentFloor, gameStatus: { type: "results" } }));

		switch (result) {
			case "win":
				GlobalStore.UpdateVariableProperty("gold", "gold", (pV) => pV + currentFloor);
				break;
			case "lose":
				GlobalStore.UpdateVariableProperty("inventory", "inventory", (pV) => ({ enemy: pV.enemy, player: [] }));
				break;
		}
	}
}
