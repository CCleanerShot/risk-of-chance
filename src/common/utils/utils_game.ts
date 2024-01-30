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

		trashCan: {
			player: 1,
			enemy: 1,
		},
	};

	static specialRolls = {
		exitRoom: () => Math.random() < 0.2,
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

	static StartFloor(floor: number, possibleSpecialRooms: boolean) {
		// TODO: add more cool things to a floor

		if (possibleSpecialRooms) {
			const isSuccess = UtilsGame.specialRolls.exitRoom();
			if (isSuccess) {
				GlobalStore.Update("game", "game", ({ currentFloor, gameStatus }) => ({ currentFloor: currentFloor, gameStatus: { type: "exit" } }));
				return;
			}
		}

		let inventory: (Item | null)[] = UtilsGame.CreateEnemyInventory(floor) as Item[];
		const items = UtilsGame.SelectRandomBattleItems(inventory as Item[], "enemy");
		inventory = inventory.map((i) => (items.includes(i) ? null : i));

		UtilsGame.EnableAllItems();

		GlobalStore.Update("inventory", "inventory", ({ enemy, player }) => ({ enemy: inventory, player: player }));
		GlobalStore.Update("battleItems", "battleItems", ({ enemy, player }) => ({ enemy: items, player: player }));
		GlobalStore.Update("game", "game", { currentFloor: floor, gameStatus: { type: "battle" } });
	}

	static AttemptJourney(floor: number) {
		const { enemy, player } = GlobalStore.getFromStore("inventory").inventory;
		const currentInv = player.filter((item) => item?.type);
		const minItemsNeeded = UtilsGame.maxStorage.battleItems["player"] * 3;

		if (currentInv.length > 0 && currentInv.length < 9) {
			GlobalStore.Update("updateMessage", "updateMessage", { msg: `You need atleast ${minItemsNeeded} to start!`, type: "error" });
			return;
		}

		if (!currentInv.length) {
			GlobalStore.Update("updateMessage", "updateMessage", { msg: "Giving starter items...", type: "log" });
			GlobalStore.Update("inventory", "inventory", ({ enemy, player }) => ({ enemy, player: [...UtilsGame.STARTING_INVENTORY] }));
		}

		UtilsGame.StartFloor(floor, false);
	}

	static GetStorage(type: StorageTypes, owner: ActorTypes) {
		switch (type) {
			case "backpack":
				return GlobalStore.getFromStore("backpack").backpack;
			case "battleItems":
				return GlobalStore.getFromStore("battleItems").battleItems[owner];
			case "inventory":
				return GlobalStore.getFromStore("inventory").inventory[owner];
			case "rewards":
				return GlobalStore.getFromStore("rewards").rewards;
			case "trashCan":
				return GlobalStore.getFromStore("trashCan").trashCan;
		}
	}

	static MoveItem(actor: ActorTypes, item: Item, source: StorageTypes, destination: StorageTypes) {
		const storageSource = UtilsGame.GetStorage(source, actor);
		const storageDestination = UtilsGame.GetStorage(destination, actor);
		const foundSourceIndex = storageSource.findIndex((i) => i === item);
		const amountOfItems = storageDestination.filter((i) => !!i);

		if (foundSourceIndex === -1) {
			GlobalStore.Update("updateMessage", "updateMessage", { msg: `Cannot move: original item is missing`, type: "error" });
			return;
		}

		if (amountOfItems.length >= UtilsGame.maxStorage[destination][actor]) {
			GlobalStore.Update("updateMessage", "updateMessage", { msg: `Cannot move: max capacity reached for ${destination}`, type: "warn" });
			return;
		}

		storageSource[foundSourceIndex] = null;

		const foundDestinationNullIndex = storageDestination.findIndex((i) => i === null);
		if (foundDestinationNullIndex === -1) {
			storageDestination.push(item); // in the case that the array didnt contain null values
		} else {
			storageDestination[foundDestinationNullIndex] = item; // in the case that the array contained null values
		}

		GlobalStore.Update("backpack", "backpack", (backpack) => [...backpack]);
		GlobalStore.Update("inventory", "inventory", (inventory) => ({ ...inventory }));
		GlobalStore.Update("battleItems", "battleItems", (battleItems) => ({ ...battleItems }));
		GlobalStore.Update("rewards", "rewards", (rewards) => [...rewards]);
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
		const items = GlobalStore.getFromStore("battleItems").battleItems[actor];
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
			const items = GlobalStore.getFromStore("battleItems").battleItems[actor];
			const dices = items.filter((item) => item?.type === "dice") as Item<"dice">[];
			const rolls = dices.map((dice) => ({ item: dice, value: Math.round(Utils.Random(1, dice.sides)) }));
			const total = rolls.reduce((pV, cV) => pV + cV.value, 0);
			return { rolls: rolls, total: total };
		}

		function BattleStep(result: ResultsTypes) {
			const target: ActorTypes = result === "lose" ? "player" : "enemy";
			const newHealth = Math.max(0, GlobalStore.getFromStore("health").health[target].current - 1);

			if (newHealth === 0) {
				UtilsGame.EndBattle(result);
				return;
			}

			const { enemy, player } = GlobalStore.getFromStore("inventory").inventory;
			const newBattleItems = UtilsGame.SelectRandomBattleItems(enemy, "enemy");
			newBattleItems.forEach((item) => UtilsGame.MoveItem("enemy", item, "inventory", "battleItems"));
			GlobalStore.Update("inventory", "inventory", (inv) => inv);
			GlobalStore.Update("battleResult", "battleResult", result);
			GlobalStore.Update("health", "health", ({ enemy, player }) => ({
				enemy: { current: target === "enemy" ? newHealth : enemy.current, max: enemy.max },
				player: { current: target === "player" ? newHealth : player.current, max: player.max },
			}));
		}

		const enemyResults = GetDiceRollsAndTotal("enemy");
		const playerResults = GetDiceRollsAndTotal("player");

		const caseDraw = enemyResults.total === playerResults.total;
		const caseWin = enemyResults.total < playerResults.total;
		const caseLose = enemyResults.total > playerResults.total;

		GlobalStore.Update("battleResult", "rolls", ({ enemy, player }) => ({ enemy: [...enemy, ...enemyResults.rolls], player: [...player, ...playerResults.rolls] }));
		switch (true) {
			case caseDraw:
				GlobalStore.Update("battleResult", "battleResult", "draw");
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

	static EnableAllItems(actor?: ActorTypes, exception?: (item: Item) => boolean) {
		const inventory = GlobalStore.getFromStore("inventory").inventory;

		if (actor) {
			const filtered = exception ? inventory[actor].filter((item) => !exception(item)) : inventory[actor];
			filtered.forEach((item) => (item ? (item.disabled = false) : "do nothing"));
		} else {
			const { enemy, player } = inventory;
			enemy.forEach((item) => (item ? (item.disabled = false) : "do nothing"));
			player.forEach((item) => (item ? (item.disabled = false) : "do nothing"));
		}
	}

	static EndBattle(result: ResultsTypes) {
		UtilsGame.EnableAllItems();

		const { currentFloor, gameStatus } = GlobalStore.getFromStore("game").game;

		// give a random item from the enemy's inv
		const enemyInv = GlobalStore.getFromStore("inventory").inventory["enemy"];
		GlobalStore.Update("rewards", "rewards", [Utils.ShuffleArray(enemyInv)[0]]);
		GlobalStore.Update("game", "game", ({ currentFloor, gameStatus }) => ({ currentFloor: currentFloor, gameStatus: { type: "results" } }));
		GlobalStore.Update("battleResult", "rolls", { enemy: [], player: [] });

		GlobalStore.Update("health", "health", ({ enemy, player }) => ({ enemy: { ...enemy, current: enemy.max }, player: { ...player, current: player.max } }));
		switch (result) {
			case "win":
				GlobalStore.Update("finalResults", "finalResults", "win");
				GlobalStore.Update("gold", "gold", (pV) => pV + currentFloor);
				break;
			case "lose":
				GlobalStore.Update("finalResults", "finalResults", "lose");
				GlobalStore.Update("inventory", "inventory", (pV) => ({ enemy: pV.enemy, player: [] }));
				break;
		}
	}

	static ExitJourney() {
		UtilsGame.EnableAllItems();
		GlobalStore.Update("game", "game", { currentFloor: 0, gameStatus: { type: "start" } });
	}

	static Die() {
		GlobalStore.Update("inventory", "inventory", { enemy: [], player: [] });
		UtilsGame.ExitJourney();
	}
}
