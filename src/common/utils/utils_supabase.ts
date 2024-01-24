import dotenv from "dotenv";
import { Session, createClient } from "@supabase/supabase-js";
import { Database, ProviderTypes, SupabaseSession } from "@/types";
import GlobalStore from "../global_store";
import { Item, ItemDB } from "@/types/game";

const URL = process.env.NEXT_PUBLIC_SUPABASE_HOST_URL;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY;

export const supabase = createClient<Database>(URL, PUBLIC_KEY);

export const queries = {
	createUser: async (oauth_origin: string, username: string) => await supabase.from("users").insert({ oauth_origin: oauth_origin, username: username }),
	getBackpackByUserOrigin: async (user_id: string) => await supabase.from("user_dices").select("*, user_items ( user_origin, type ) ").eq("user_origin", user_id),
	addItemToBackpackByUserOrigin: async (type: string, user_id: string) => await supabase.from("user_items").insert({ type: type, user_origin: user_id }),
	addDiceDetailsToItemWithIDOriginAndUserOrigin: async (sides: number, item_id: string, user_id: string) => await supabase.from("user_dices").insert({ item_origin: item_id, sides: sides, user_origin: user_id }),
	deleteItemFromBackpackByUserOrigin: async (item_id: string, user_id: string) => await supabase.from("user_items").delete().eq("user_origin", user_id).eq("id", item_id),
} as const;

export default class UtilsSupabase {
	static updateSession() {}

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

	static GetQuery<T extends keyof typeof queries>(query: T) {
		const item = queries[query];

		const wrapperFunction = async (params: Parameters<typeof item>) => {
			GlobalStore.UpdateVariableProperty("isLoading", "isLoading", true);

			// @ts-ignore
			const result = await item(...params);

			GlobalStore.UpdateVariableProperty("isLoading", "isLoading", false);
			return result;
		};

		return {
			callQuery: (...params: Parameters<typeof item>) => wrapperFunction(params),
		};
	}
}
