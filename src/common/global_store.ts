import UtilsGame from "./utils/utils_game";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/common/utils/utils_supabase";
import { Game, Health, Item, MessageTypes, ResultsTypes, SupabaseSessionStatusTypes, PurchaseableItem, SettingTypes } from "@/types";

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

    private static callAllListeners<T extends ContextsListKeys>(variable: T) {
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
    static AddVariable<T extends Record<string, any>>(variable: T): T {
        GlobalStore.globalStore.push({ variable: variable, listeners: [] });
        return variable as T;
    }

    /**
     * adds a listener to a variable. whenever the variable is updated, or a wrapper function manually calls for an update, all listeners of that variable will be called
     * @param variable the variable to be listened on (comes from a static list)
     * @param listener a function that will be called whenever the variable is updated with 'GlobalStore.Update', or a wrapper function is called
     * @param listenerArgs optional listener parameters of a listener
     */
    static AddListener<T extends ContextsListKeys, K extends (args: any) => void>(variable: T, listener: K, ...listenerArgs: K extends (...args: infer Params) => any ? Params : never) {
        const foundVariable = GlobalStore.findVariable(contextsList[variable]);
        foundVariable.listeners.push({ listener: listener, listenerArgs: listenerArgs });
    }

    /**
     * removes a listener to of a variable, if it does not exist, it will just throw a warning in the console
     * @param variable the variable to be removed on (comes from a static list)
     * @param listener a function that will be removed
     */
    static RemoveListener<T extends ContextsListKeys, K extends (args: any) => void>(variable: T, listener: K, ...listenerArgs: K extends (...args: infer Params) => any ? Params : never) {
        const foundVariable = GlobalStore.findVariable(contextsList[variable]);
        const foundIndex = foundVariable.listeners.findIndex((searchListener) => searchListener.listener === listener);

        if (foundIndex) {
            foundVariable.listeners.splice(foundIndex, 1);
        }
    }

    /**
     * removes all listener to of a variable
     * @param variable the variable to be removed on (comes from a static list)
     */
    static RemoveAllListeners<T extends ContextsListKeys>(variable: T) {
        const foundVariable = GlobalStore.findVariable(contextsList[variable]);
        foundVariable.listeners = [];
    }

    /**
     * updates a property from a variable, to which after, all listeners of the variable will be called. is 1 of 2 ways the listeners of a variable can be automatically called
     * @param variable variable to be updated
     * @param property property of the variable to actually be updated
     * @param updatedValue the new value of the chosen variable's property
     */
    static Update<T extends ContextsListKeys, K extends keyof (typeof contextsList)[T], U extends (typeof contextsList)[T][K] | ((args: (typeof contextsList)[T][K]) => (typeof contextsList)[T][K])>(variable: T, property: K, updatedValue: U) {
        const foundVariable = GlobalStore.findVariable(contextsList[variable]);
        if (typeof updatedValue === "function") {
            foundVariable.variable[property] = updatedValue(foundVariable.variable[property]);
        } else {
            foundVariable.variable[property] = updatedValue;
        }

        GlobalStore.updateTimestamp();
        GlobalStore.callAllListeners(variable);
    }

    /** @returns destructure-able object containing specified item in the store */
    static getFromStore = <T extends ContextsListKeys>(variable: T) => {
        return contextsList[variable];
    };

    /** @returns destructure-able object containing all the current items in the store */
    static getFromStoreAll = () => {
        return contextsList;
    };
}

/** TO ENSURE INTELLISENSE, JUST ADD ADDITIONAL ITEMS HERE AS NEEDED */
export const contextsList = {
    backpack: GlobalStore.AddVariable({ backpack: [] as Item[] }),
    battleItems: GlobalStore.AddVariable({ battleItems: { player: [] as (Item | null)[], enemy: [] as (Item | null)[] } }),
    battleResult: GlobalStore.AddVariable({ battleResult: null as ResultsTypes | null, rolls: { enemy: [] as { item: Item<"dice">; value: number }[], player: [] as { item: Item<"dice">; value: number }[] } }),
    finalResults: GlobalStore.AddVariable({ finalResults: "draw" as ResultsTypes }),
    game: GlobalStore.AddVariable({ game: { gameStatus: "start", currentFloor: UtilsGame.MIN_FLOORS } as Game }),
    gold: GlobalStore.AddVariable({ gold: 0 }),
    health: GlobalStore.AddVariable({ health: { player: { current: UtilsGame.maxHealth["player"], max: UtilsGame.maxHealth["player"] } as Health, enemy: { current: UtilsGame.maxHealth["enemy"], max: UtilsGame.maxHealth["enemy"] } as Health } }),
    inventory: GlobalStore.AddVariable({ inventory: { player: [] as (Item | null)[], enemy: [] as (Item | null)[] } }),
    isLoading: GlobalStore.AddVariable({ isLoading: false }),
    modalAuth: GlobalStore.AddVariable({ isOpened: false }),
    modalSettings: GlobalStore.AddVariable({ isOpened: false }),
    modalCreateUser: GlobalStore.AddVariable({ isOpened: false }),
    rewards: GlobalStore.AddVariable({ rewards: [] as Item[] }),
    shop: GlobalStore.AddVariable({ shop: [] as PurchaseableItem[] }),
    settings: GlobalStore.AddVariable({ settings: { moveItem: "Q", deleteItem: "W" } }),
    settingToChange: GlobalStore.AddVariable({ settingToChange: null as SettingTypes | null }),
    supabaseClient: GlobalStore.AddVariable({ supabaseClient: supabase }),
    supabaseSession: GlobalStore.AddVariable({ session: null as Session | null, status: "none" as SupabaseSessionStatusTypes }),
    trashCan: GlobalStore.AddVariable({ trashCan: [] as Item[] }),
    updateMessage: GlobalStore.AddVariable({ updateMessage: { msg: "", type: "log" as MessageTypes } }),
    upgradePeeker: GlobalStore.AddVariable({ amount: 0 }),
    upgradeStarter: GlobalStore.AddVariable({ amount: 0 }),
    username: GlobalStore.AddVariable({ username: "" }),
    viewSelected: GlobalStore.AddVariable({ floorSelect: 1, inventorySelect: null as Item, backpackSelect: null as Item }),
} as const;
