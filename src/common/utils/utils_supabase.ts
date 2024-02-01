import GlobalStore from "../global_store";
import { createClient } from "@supabase/supabase-js";
import { Item } from "@/types/local";
import { Database, Json, ProviderTypes } from "@/types";

const URL = process.env.NEXT_PUBLIC_SUPABASE_HOST_URL;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY;
const ENVIRONMENT = process.env.ENVIRONMENT;
console.log("test", ENVIRONMENT === "development", ENVIRONMENT === "production", process.env.NEXT_PUBLIC_HOMEPAGE_PROD);

const DEV_PAGE = process.env.NEXT_PUBLIC_HOMEPAGE_DEV;
const PROD_PAGE = process.env.NEXT_PUBLIC_HOMEPAGE_PROD;
const HOMEPAGE = ENVIRONMENT === "development" ? DEV_PAGE : ENVIRONMENT === "production" ? PROD_PAGE : DEV_PAGE;

export const supabase = createClient<Database>(URL, PUBLIC_KEY);

// prettier-ignore
export const queries = {
	createUser: async (oauth_origin: string, username: string) => await supabase.from("users").insert({ oauth_origin: oauth_origin, username: username, inventory: null }),
	getData: async(oauth_origin: string) => await supabase.from('users').select().eq('oauth_origin', oauth_origin),
	updateData: async (backpack: Item[], inventory: Item[], gold: number, session_id: string) => await supabase.from("users").update({ backpack: JSON.stringify(backpack), inventory: JSON.stringify(inventory), gold: gold }).eq("oauth_origin", session_id),
} as const;

export default class UtilsSupabase {
	static GetQuery<T extends keyof typeof queries>(query: T) {
		const item = queries[query];

		const wrapperFunction = async (params: Parameters<typeof item>) => {
			GlobalStore.Update("isLoading", "isLoading", true);

			// @ts-ignore
			const result = await item(...params);

			GlobalStore.Update("isLoading", "isLoading", false);
			return result;
		};

		return {
			callQuery: (...params: Parameters<typeof item>) => wrapperFunction(params),
		};
	}

	static SignInWithProvider(provider: ProviderTypes) {
		switch (provider) {
			case "github": {
				const queryParams = { access_type: "offline", prompt: "consent" };
				supabase.auth.signInWithOAuth({ provider: provider, options: { queryParams: queryParams } });
				break;
			}
			case "google": {
				const queryParams = { access_type: "offline", prompt: "consent" };
				supabase.auth.signInWithOAuth({ provider: provider, options: { queryParams: queryParams } });
				break;
			}
		}
	}

	static async Load() {
		function verifyItemInsideStorage(json: Json): boolean {
			const foundItem = JSON.parse(json as string) as Item[];

			if (!foundItem?.[0] || !foundItem?.length) {
				return true; // just an empty array
			}

			if (foundItem[0]?.type === undefined || foundItem[0].disabled === undefined) {
				return false;
			}

			return true;
		}

		const session_id = GlobalStore.getFromStore("supabaseSession").session?.user.id;

		if (!session_id) {
			GlobalStore.Update("updateMessage", "updateMessage", { msg: "Session missing. Perhaps you cleared cookies?", type: "error" });
			return;
		}

		const { data, error } = await UtilsSupabase.GetQuery("getData").callQuery(session_id);

		if (error) {
			GlobalStore.Update("updateMessage", "updateMessage", { msg: "Server error: Failure to connect to remote server.", type: "error" });
			return;
		}

		if (!data) {
			GlobalStore.Update("updateMessage", "updateMessage", { msg: "Server error: No data found.", type: "error" });
			return;
		}

		const { backpack, inventory, gold } = data[0];
		const foundGold = data[0].gold;
		const foundBackpack = JSON.parse(backpack as string) as Item[];
		const foundInventory = JSON.parse(inventory as string) as Item[];

		if (!verifyItemInsideStorage(backpack)) {
			GlobalStore.Update("updateMessage", "updateMessage", { msg: "Warning: Found backpack is of an invalid format.", type: "warn" });
			return;
		}

		if (!verifyItemInsideStorage(inventory)) {
			GlobalStore.Update("updateMessage", "updateMessage", { msg: "Warning: Found inventory is of an invalid format.", type: "warn" });
			return;
		}

		GlobalStore.Update("gold", "gold", foundGold);
		GlobalStore.Update("backpack", "backpack", foundBackpack);
		GlobalStore.Update("inventory", "inventory", ({ enemy, player }) => ({ enemy, player: foundInventory }));
		GlobalStore.Update("updateMessage", "updateMessage", { msg: "Load success!", type: "log" });
	}

	static async Save() {
		const session_id = GlobalStore.getFromStore("supabaseSession").session?.user.id;

		if (!session_id) {
			GlobalStore.Update("updateMessage", "updateMessage", { msg: "Session missing. Perhaps you cleared cookies?", type: "error" });
			return;
		}

		const backpack = GlobalStore.getFromStore("backpack").backpack;
		const inventory = GlobalStore.getFromStore("inventory").inventory["player"];
		const gold = GlobalStore.getFromStore("gold").gold;

		const { data, error } = await UtilsSupabase.GetQuery("updateData").callQuery(backpack, inventory, gold, session_id);

		if (error) {
			GlobalStore.Update("updateMessage", "updateMessage", { msg: "Server error: failed to connect to remote server.", type: "error" });
			return;
		}

		GlobalStore.Update("updateMessage", "updateMessage", { msg: "Save success!", type: "log" });
	}
}
