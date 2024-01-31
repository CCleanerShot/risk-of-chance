import Button from "@/app/components/UI/Button";
import UtilsSupabase from "@/common/utils/utils_supabase";
import React from "react";
import { twMerge } from "tailwind-merge";

interface LoadProps {
	disabled: boolean;
	className?: string;
}

const Load = ({ disabled, className }: LoadProps) => {
	const handleLoad = () => {
		UtilsSupabase.Load();
	};

	return (
		<Button onClick={handleLoad} disabled={disabled} template="darker_inner" className={twMerge(disabled ? "text-slate-800" : "", className)}>
			LOAD
		</Button>
	);
};

export default Load;
