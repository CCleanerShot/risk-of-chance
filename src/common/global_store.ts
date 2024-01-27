import { supabase } from "@/common/utils/utils_supabase";
import { MessageTypes, SupabaseSessionStatusTypes } from "@/types";
import { Backpack, Game, Health, Item } from "@/types/game";
import { Session } from "@supabase/supabase-js";
import UtilsGame from "./utils/utils_game";

type VariableType<T extends any, K extends (args: any) => void> = {
	variable: T;
	listeners: { listener: (args?: any) => void; listenerArgs?: ReturnType<K> }[];
};

export type ContextsListKeys = keyof typeof contextsList;

export default class GlobalStore {
	private static globalStore: VariableType<any, any>[] = [];
	static lastUpdated: number = Date.now();
	constructor() {}

	private static updateTimestamp() {
		GlobalStore.lastUpdated = Date.now();
	}

	private static findVariable(variable: any) {
		const foundVariable = GlobalStore.globalStore.find((item) => variable == item.variable);
		if (!foundVariable) throw new Error(`Could not find variable inside 'globalStore'. Perhaps its missing from 'contextsList'?`);
		return foundVariable;
	}

	private static callAllListenersOfVariable<T extends ContextsListKeys>(variable: T) {
		const foundVariable = GlobalStore.findVariable(contextsList[variable]);
		foundVariable.listeners.forEach((listener) => {
			if (listener.listenerArgs) {
				listener.listener(listener.listenerArgs);
			} else {
				listener.listener();
			}
		});
	}

	/**
	 * adds a variable to the global store, which can both be access organically, and be utilized for classic event-listener pattern behaviors
	 * @param variable an object with potential properties to be updated, and listened to
	 * @returns
	 */
	static AddVariableToGlobalStore<T extends Record<string, any>>(variable: T): T {
		GlobalStore.globalStore.push({ variable: variable, listeners: [] });
		return variable as T;
	}

	/**
	 * adds a listener to a variable. whenever the variable is updated, or a wrapper function manually calls for an update, all listeners of that variable will be called
	 * @param variable the variable to be listened on (comes from a static list)
	 * @param listener a function that will be called whenever the variable is updated with 'GlobalStore.UpdateVariableProperty', or a wrapper function is called
	 * @param listenerArgs optional listener parameters of a listener
	 */
	static AddListenerToVariable<T extends ContextsListKeys, K extends (args: any) => void>(variable: T, listener: K, ...listenerArgs: K extends (...args: infer Params) => any ? Params : never) {
		const foundVariable = GlobalStore.findVariable(contextsList[variable]);
		foundVariable.listeners.push({ listener: listener, listenerArgs: listenerArgs });
	}

	/**
	 * removes a listener to of a variable, if it does not exist, it will just throw a warning in the console
	 * @param variable the variable to be removed on (comes from a static list)
	 * @param listener a function that will be removed
	 */
	RemoveListenerToVariable<T extends ContextsListKeys, K extends (args: any) => void>(variable: T, listener: K, ...listenerArgs: K extends (...args: infer Params) => any ? Params : never) {
		const foundVariable = GlobalStore.findVariable(contextsList[variable]);

		const foundIndex = foundVariable.listeners.findIndex((searchListener) => searchListener.listener === listener);

		foundVariable.listeners.push({ listener: listener, listenerArgs: listenerArgs });
	}
	/**
	 * updates a property from a variable, to which after, all listeners of the variable will be called. is 1 of 2 ways the listeners of a variable can be automatically called
	 * @param variable variable to be updated
	 * @param property property of the variable to actually be updated
	 * @param updatedValue the new value of the chosen variable's property
	 */
	static UpdateVariableProperty<T extends ContextsListKeys, K extends keyof (typeof contextsList)[T], U extends (typeof contextsList)[T][K] | ((args: (typeof contextsList)[T][K]) => (typeof contextsList)[T][K])>(variable: T, property: K, updatedValue: U) {
		const foundVariable = GlobalStore.findVariable(contextsList[variable]);
		if (typeof updatedValue === "function") {
			foundVariable.variable[property] = updatedValue(foundVariable.variable[property]);
		} else {
			foundVariable.variable[property] = updatedValue;
		}

		GlobalStore.updateTimestamp();
		GlobalStore.callAllListenersOfVariable(variable);
	}

	/** @returns destructure-able object containing specified item in the store */
	static getFromGlobalStore = <T extends ContextsListKeys>(variable: T) => {
		return contextsList[variable];
	};

	/** @returns destructure-able object containing all the current items in the store */
	static getFromGlobalStoreAll = () => {
		return contextsList;
	};
}

/** @deprecated unused for now, was meant to be another way for a variable to be called (almost like a decorator) */
export const wrapperList = {};

/** TO ENSURE INTELLISENSE, JUST ADD ADDITIONAL ITEMS HERE AS NEEDED */
export const contextsList = {
	backpack: GlobalStore.AddVariableToGlobalStore({ backpack: [] as Backpack }),
	battleItems: GlobalStore.AddVariableToGlobalStore({ battleItems: { player: [] as Item[], enemy: [] as Item[] } }),
	playerDetails: GlobalStore.AddVariableToGlobalStore({ playerDetails: { name: "" } }),
	game: GlobalStore.AddVariableToGlobalStore({ game: { gameStatus: { type: "start" }, currentFloor: UtilsGame.MIN_FLOORS } as Game }),
	health: GlobalStore.AddVariableToGlobalStore({ health: { player: { current: UtilsGame.maxHealth["player"], max: UtilsGame.maxHealth["player"] } as Health, enemy: { current: UtilsGame.maxHealth["enemy"], max: UtilsGame.maxHealth["enemy"] } as Health } }),
	inventory: GlobalStore.AddVariableToGlobalStore({ inventory: { player: [] as Item[], enemy: [] as Item[] } }),
	isLoading: GlobalStore.AddVariableToGlobalStore({ isLoading: false }),
	supabaseClient: GlobalStore.AddVariableToGlobalStore({ supabaseClient: supabase }),
	modalAuth: GlobalStore.AddVariableToGlobalStore({ isOpened: false }),
	supabaseSession: GlobalStore.AddVariableToGlobalStore({ session: null as Session | null, status: "none" as SupabaseSessionStatusTypes }),
	updateMessage: GlobalStore.AddVariableToGlobalStore({ updateMessage: { msg: "", type: "log" as MessageTypes } }),
	viewSelected: GlobalStore.AddVariableToGlobalStore({ floorSelect: 1, itemSelect: { type: "dice" } as Item }),
} as const;
