import React from "react";
import Button from "@/app/components/UI/Button";
import Utils from "@/common/utils/utils";
import { ProviderTypes } from "@/types";
import UtilsSupabase from "@/common/utils/utils_supabase";
import Image from "next/image";

interface ModalAuthProviderProps {
	provider: ProviderTypes;
}
const ModalAuthProvider = ({ provider }: ModalAuthProviderProps) => {
	const handleClick = async () => {
		UtilsSupabase.SignInWithProvider(provider);
	};

	return (
		<Button onClick={handleClick} template="none" className="flex justify-between gap-2 group bg-white">
			<span className="m-auto">{`Join with ${Utils.FirstLetterUppercase(provider)}`}</span>
			<Image src={`images/${provider}.svg`} alt={`image of ${provider} logo`} width={1} height={1} className="flex-1" />
		</Button>
	);
};

export default ModalAuthProvider;
