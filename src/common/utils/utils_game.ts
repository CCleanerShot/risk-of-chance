import Utils from "../utils/utils";
import GlobalStore from "../global_store";
import { StorageTypes } from "@/types";
import { ActorTypes, ResultsTypes, Item } from "@/types";

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

		battleItems: {
			player: 3,
			enemy: 3,
		},

		inventory: {
			player: 12,
			enemy: 9,
		},

		rewards: {
			player: 3,
			enemy: 3,
		},

		trashcan: {
			player: 1,
			enemy: 1,
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
		inv.push({ type: "dice", sides: floor, disabled: false } as Item<"dice">);

		// minimum amount of sides the other dice can be
		const remainingPool = totalPool - floor;
		const min = Math.max(Math.floor((floor / 3) * 2), 1);

		const itemSlotsLeft = UtilsGame.maxStorage.inventory["enemy"] - 1;
		const randomNumbers = Utils.MakeArray(itemSlotsLeft, (i) => Utils.Random(min, floor));
		const sum = randomNumbers.reduce((pV, cV) => pV + cV, 0);
		const randomWeights = randomNumbers.map((number) => number / sum);
		const finalNumbers = randomWeights.map((weight) => Math.min(Math.round(weight * remainingPool), floor));

		inv.push(...finalNumbers.map((number) => ({ type: "dice", sides: number, disabled: false } as Item<"dice">)));

		return inv as Item[];
	}

	static SelectRandomBattleItems(items: Item[], source: ActorTypes) {
		const shuffled = Utils.ShuffleArray(items);
		const array = Utils.MakeArray(UtilsGame.maxStorage.battleItems[source], () => null) as Item[];
		let fillableIndex = 0;
		for (let i = 0; i < shuffled.length; i++) {
			const currentItem = shuffled[i];
			const isDisabled = currentItem?.disabled;
			const isNull = currentItem === null;

			if (fillableIndex > array.length - 1) {
				break;
			}

			if (!isDisabled && !isNull) {
				array[fillableIndex] = currentItem;
				fillableIndex++;
			}
		}

		return array;
	}

	static GenerateFloor(floor: number) {
		// TODO: add more cool things to a floor
		let inventory: (Item | null)[] = UtilsGame.CreateEnemyInventory(floor) as Item[];
		const items = UtilsGame.SelectRandomBattleItems(inventory as Item[], "enemy");
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

	static GetStorage(type: StorageTypes, owner: ActorTypes) {
		switch (type) {
			case "backpack":
				return GlobalStore.getFromGlobalStore("backpack").backpack;
			case "battleItems":
				return GlobalStore.getFromGlobalStore("battleItems").battleItems[owner];
			case "inventory":
				return GlobalStore.getFromGlobalStore("inventory").inventory[owner];
			case "rewards":
				return GlobalStore.getFromGlobalStore("rewards").rewards;
			case "trashcan":
				return GlobalStore.getFromGlobalStore("trashcan").trashcan;
		}
	}

	static MoveItem(actor: ActorTypes, item: Item, source: StorageTypes, destination: StorageTypes) {
		const storageSource = UtilsGame.GetStorage(source, actor);
		const storageDestination = UtilsGame.GetStorage(destination, actor);
		const foundSourceIndex = storageSource.findIndex((i) => i === item);
		const amountOfItems = storageDestination.filter((i) => !!i);

		if (foundSourceIndex === -1) {
			GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: `Cannot move: original item is missing`, type: "error" });
			return;
		}

		if (amountOfItems.length >= UtilsGame.maxStorage[destination][actor]) {
			GlobalStore.UpdateVariableProperty("updateMessage", "updateMessage", { msg: `Cannot move: max capacity reached for ${destination}`, type: "warn" });
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
		GlobalStore.UpdateVariableProperty("rewards", "rewards", (rewards) => [...rewards]);
	}

	static GenerateLoot(items: Item[], floor: number, roll: number): Item[] {
		const result = Math.random() * roll;

		if (result < 0.5) {
			return items;
		}

		items.push({ disabled: false, sides: floor, type: "dice" } as Item<"dice">);
		return UtilsGame.GenerateLoot(items, floor, result);
	}

	static ShelveBattleItems(actor: ActorTypes) {
		const items = GlobalStore.getFromGlobalStore("battleItems").battleItems[actor];
		items.forEach((item) => {
			if (item === null) {
				return;
			} else {
				item.disabled = true;
				UtilsGame.MoveItem(actor, item, "battleItems", "inventory");
			}
		});
	}

	static DoBattle() {
		function GetDiceRollsAndTotal(actor: ActorTypes) {
			const items = GlobalStore.getFromGlobalStore("battleItems").battleItems[actor];
			const dices = items.filter((item) => item?.type === "dice") as Item<"dice">[];
			const rolls = dices.map((dice) => ({ item: dice, value: Math.round(Utils.Random(1, dice.sides)) }));
			const total = rolls.reduce((pV, cV) => pV + cV.value, 0);
			return { rolls: rolls, total: total };
		}

		function BattleStep(result: ResultsTypes) {
			const target: ActorTypes = result === "lose" ? "player" : "enemy";
			const newHealth = Math.max(0, GlobalStore.getFromGlobalStore("health").health[target].current - 1);

			if (newHealth === 0) {
				UtilsGame.EndBattle(result);
				return;
			}

			const { enemy, player } = GlobalStore.getFromGlobalStore("inventory").inventory;
			const newBattleItems = UtilsGame.SelectRandomBattleItems(enemy, "enemy");
			newBattleItems.forEach((item) => UtilsGame.MoveItem("enemy", item, "inventory", "battleItems"));
			GlobalStore.UpdateVariableProperty("inventory", "inventory", (inv) => inv);
			GlobalStore.UpdateVariableProperty("battleResult", "battleResult", result);
			GlobalStore.UpdateVariableProperty("health", "health", ({ enemy, player }) => ({
				enemy: { current: target === "enemy" ? newHealth : enemy.current, max: enemy.max },
				player: { current: target === "player" ? newHealth : player.current, max: player.max },
			}));
		}

		const enemyResults = GetDiceRollsAndTotal("enemy");
		const playerResults = GetDiceRollsAndTotal("player");

		const caseDraw = enemyResults.total === playerResults.total;
		const caseWin = enemyResults.total < playerResults.total;
		const caseLose = enemyResults.total > playerResults.total;

		GlobalStore.UpdateVariableProperty("battleResult", "rolls", ({ enemy, player }) => ({ enemy: [...enemy, ...enemyResults.rolls], player: [...player, ...playerResults.rolls] }));
		switch (true) {
			case caseDraw:
				GlobalStore.UpdateVariableProperty("battleResult", "battleResult", "draw");
				break;

			case caseLose:
			case caseWin:
				UtilsGame.ShelveBattleItems("enemy");
				UtilsGame.ShelveBattleItems("player");

				if (caseLose) {
					BattleStep("lose");
					break;
				}

				if (caseWin) {
					BattleStep("win");
					break;
				}
		}
	}

	static EnableAllItems(actor: ActorTypes, exception?: (item: Item) => boolean) {
		const inventory = GlobalStore.getFromGlobalStore("inventory").inventory[actor];
		const filtered = exception ? inventory.filter((item) => !exception(item)) : inventory;
		filtered.forEach((item) => (item ? (item.disabled = false) : "do nothing"));
	}

	static EndBattle(result: ResultsTypes) {
		UtilsGame.EnableAllItems("enemy");
		UtilsGame.EnableAllItems("player");

		const { currentFloor, gameStatus } = GlobalStore.getFromGlobalStore("game").game;

		// give a random item from the enemy's inv
		const enemyInv = GlobalStore.getFromGlobalStore("inventory").inventory["enemy"];
		GlobalStore.UpdateVariableProperty("rewards", "rewards", [Utils.ShuffleArray(enemyInv)[0]]);
		GlobalStore.UpdateVariableProperty("game", "game", ({ currentFloor, gameStatus }) => ({ currentFloor: currentFloor, gameStatus: { type: "results" } }));

		switch (result) {
			case "win":
				GlobalStore.UpdateVariableProperty("finalResults", "finalResults", "win");
				GlobalStore.UpdateVariableProperty("gold", "gold", (pV) => pV + currentFloor);
				break;
			case "lose":
				GlobalStore.UpdateVariableProperty("finalResults", "finalResults", "lose");
				GlobalStore.UpdateVariableProperty("inventory", "inventory", (pV) => ({ enemy: pV.enemy, player: [] }));
				break;
		}
	}
}
