import { Item } from "@/types/game";
import Utils from "../utils/utils";
import GlobalStore, { ContextsListKeys } from "../global_store";
import { StorageTypes } from "@/types";
import { NPCTypes } from "@/types/local";

export default class UtilsGame {
	static MIN_DIFFICULTY = 9;
	static MAX_DIFFICULTY = 680;
	static MIN_FLOORS = 1;
	static MAX_FLOORS = 100;
	static slope = (UtilsGame.MAX_DIFFICULTY - UtilsGame.MIN_DIFFICULTY) / (UtilsGame.MAX_FLOORS - UtilsGame.MIN_FLOORS);
	static intercept = UtilsGame.MIN_DIFFICULTY / UtilsGame.slope;

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
			player: 9,
			enemy: 9,
		},

		battleItems: {
			player: 3,
			enemy: 3,
		},
	};

	static STARTING_INVENTORY: Item[] = [
		{ type: "dice", sides: 1 },
		{ type: "dice", sides: 1 },
		{ type: "dice", sides: 1 },
		{ type: "dice", sides: 1 },
		{ type: "dice", sides: 1 },
		{ type: "dice", sides: 1 },
		{ type: "dice", sides: 2 },
		{ type: "dice", sides: 2 },
		{ type: "dice", sides: 2 },
	] as const;

	static CreateEnemyInventory(floor: number): Item[] {
		const inv: Item[] = [];
		const totalPool = Math.floor(UtilsGame.slope * floor + UtilsGame.intercept);

		// have atleast 1 dice equal to the floor of the floor
		inv.push({ type: "dice", sides: floor });

		// minimum amount of sides the other dice can be
		const remainingPool = totalPool - floor;
		const min = Math.max(Math.floor((floor / 3) * 2), 1);

		const itemSlotsLeft = UtilsGame.maxStorage.inventory["enemy"] - 1;
		const randomNumbers = Utils.MakeArray(itemSlotsLeft, (i) => Utils.Random(min, floor));
		const sum = randomNumbers.reduce((pV, cV) => pV + cV, 0);
		const randomWeights = randomNumbers.map((number) => number / sum);
		const finalNumbers = randomWeights.map((weight) => Math.min(Math.ceil(weight * remainingPool), floor));

		inv.push(...finalNumbers.map((number) => ({ type: "dice", sides: number } as Item)));
		return inv as Item[];
	}

	static SelectBattleItems(items: Item[], source: NPCTypes) {
		const shuffled = Utils.ShuffleArray(items);
		return shuffled.splice(0, UtilsGame.maxHealth[source] + 1);
	}

	static GenerateFloor(floor: number) {
		// TODO: add more cool things to a floor
		const inventory = UtilsGame.CreateEnemyInventory(floor);
		const items = UtilsGame.SelectBattleItems(inventory, "enemy");
		const { enemy: enemyInv, player: playerInv } = GlobalStore.getFromGlobalStore("inventory").inventory;
		const { enemy: enemyItems, player: playerItems } = GlobalStore.getFromGlobalStore("battleItems").battleItems;

		// TODO: fix order i think
		GlobalStore.UpdateVariableProperty("inventory", "inventory", { enemy: inventory, player: playerInv });
		GlobalStore.UpdateVariableProperty("battleItems", "battleItems", { enemy: items, player: playerItems });
		GlobalStore.UpdateVariableProperty("game", "game", { currentFloor: floor, gameStatus: { type: "battle", turn: "player" } });
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

	static MoveItem(item: Item, source: StorageTypes, destination: StorageTypes) {
		const storageSource = UtilsGame.GetStorage(source, "player");
		const storageDestination = UtilsGame.GetStorage(destination, "player");

		const foundSourceIndex = storageSource.findIndex((i) => i === item);
		const amountOfItems = storageDestination.filter((i) => i?.type);
		if (amountOfItems.length >= UtilsGame.maxStorage[destination].player) {
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

		GlobalStore.UpdateVariableProperty("backpack", "backpack", (backpack) => (backpack.length ? [] : [...backpack]));
		GlobalStore.UpdateVariableProperty("inventory", "inventory", (inventory) => ({ ...inventory }));
		GlobalStore.UpdateVariableProperty("battleItems", "battleItems", (battleItems) => ({ ...battleItems }));
	}

	static DoBattle() {
		const { enemy, player } = GlobalStore.getFromGlobalStore("battleItems").battleItems;
	}

	static UseItems(source: NPCTypes, items: Item[]) {
		items.map((i) => {
			switch (i?.type) {
				case "dice":
					return Math.floor(Utils.Random(1, i.sides));
				case "health":
				// TODO: add variable health increase so it isnt just 2 health
				default:
					return null;
			}
		});
	}
}
