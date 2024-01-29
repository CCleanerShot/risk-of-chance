import React from "react";
import Button from "@/app/components/UI/Button";
import SVG from "@/app/components/UI/SVG";
import Utils from "@/common/utils/utils";
import { ProviderTypes } from "@/types";
import UtilsSupabase from "@/common/utils/utils_supabase";

interface ModalAuthProviderProps {
	provider: ProviderTypes;
}
const ModalAuthProvider = ({ provider }: ModalAuthProviderProps) => {
	const handleClick = async () => {
		UtilsSupabase.SignInWithProvider(provider);
	};

	return (
		<Button onClick={handleClick} template="standard" className="flex justify-between gap-2 group">
			<div>{`Sign In/Sign Up with ${Utils.FirstLetterUppercase(provider)}`}</div>
			<SVG size="large" url={`images/${provider}.svg`} className="transition h-6 w-6 group-hover:bg-green-600" />
		</Button>
	);
};

export default ModalAuthProvider;
