import GlobalStore from "../global_store";
import { createClient } from "@supabase/supabase-js";
import { backpackConst } from "@/types/local";
import { Backpack, Database, ProviderTypes } from "@/types";

const URL = process.env.NEXT_PUBLIC_SUPABASE_HOST_URL;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY;

export const supabase = createClient<Database>(URL, PUBLIC_KEY);

// prettier-ignore
export const queries = {
	createUser: async (oauth_origin: string, username: string) => await supabase.from("users").insert({ oauth_origin: oauth_origin, username: username, inventory: null }),
	getData: async(oauth_origin: string) => await supabase.from('users').select().eq('oauth_origin', oauth_origin),
	updateData: async (backpack: Backpack,gold: number, session_id: string) => await supabase.from("users").update({ backpack: JSON.stringify(backpack), gold: gold }).eq("oauth_origin", session_id),
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
		const session_id = GlobalStore.getFromStore("supabaseSession").session?.user.id;

		if (!session_id) {
			GlobalStore.Update("updateMessage", "updateMessage", { msg: "Session missing. Perhaps you cleared cookies?", type: "error" });
			return;
		}

		const { data, error } = await UtilsSupabase.GetQuery("getData").callQuery(session_id);

		if (error) {
			GlobalStore.Update("updateMessage", "updateMessage", { msg: "Server error. Is your internet even on?", type: "error" });
			return;
		}

		const foundBackpack = JSON.parse(data?.[0].backpack as string);
		console.log(data?.[0].gold);

		// check if object is a valid backpack;
		for (const prop in backpackConst[0]) {
			if (!foundBackpack[prop]) {
				GlobalStore.Update("updateMessage", "updateMessage", { msg: "A save with invalid format found. Contact me if you see this.", type: "warn" });
				return;
			}
		}

		GlobalStore.Update("backpack", "backpack", foundBackpack);
		GlobalStore.Update("updateMessage", "updateMessage", { msg: "Load success!", type: "log" });
	}

	static async Save() {
		const session_id = GlobalStore.getFromStore("supabaseSession").session?.user.id;

		if (!session_id) {
			GlobalStore.Update("updateMessage", "updateMessage", { msg: "Session missing. Perhaps you cleared cookies?", type: "error" });
			return;
		}

		const backpack = GlobalStore.getFromStore("backpack").backpack;
		const gold = GlobalStore.getFromStore("gold").gold;
		const { data, error } = await UtilsSupabase.GetQuery("updateData").callQuery(backpack, gold, session_id);

		if (error) {
			GlobalStore.Update("updateMessage", "updateMessage", { msg: "Server error. Is your internet even on?", type: "error" });
			return;
		}

		GlobalStore.Update("updateMessage", "updateMessage", { msg: "Save success!", type: "log" });
	}
}
