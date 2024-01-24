import React from "react";
import { ModalAuthTabTypes, ProviderTypes } from "@/types";
import Utils from "@/common/utils/utils";
import Button from "@/app/components/UI/Button";
import GlobalStore from "@/common/global_store";

interface AuthorizeProps {
	method: ModalAuthTabTypes;
	provider: ProviderTypes;
}

const ButtonAuthorize = ({ method, provider }: AuthorizeProps) => {
	// const handleClick = () => {
	// 	const supabaseClient = GlobalStore.getFromGlobalStore("supabaseClient").supabaseClient;
	// 	switch (method) {
	// 		case "register":
	// 			supabaseClient.auth.signUp({});
	// 	}
	// };
	// const stringProvider = Utils.firstLetterUppercase(provider);
	// let string;
	// switch (method) {
	// 	case "register":
	// 		string = `Register with ${stringProvider}`;
	// 		break;
	// 	case "signin":
	// 		string = `Sign in with ${stringProvider}`;
	// 		break;
	// }
	// return <Button>`${string}`</Button>;

	return <div></div>;
};

export default ButtonAuthorize;
