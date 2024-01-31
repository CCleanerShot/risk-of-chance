import Button from "@/app/components/UI/Button";
import GlobalStore from "@/common/global_store";
import UtilsSupabase from "@/common/utils/utils_supabase";
import React from "react";
import { twMerge } from "tailwind-merge";

interface SettingsProps {
	className?: string;
	disabled?: boolean;
}

const Settings = ({ className, disabled }: SettingsProps) => {
	const handleSettings = () => {
		GlobalStore.Update("modalSettings", "isOpened", (prev) => !prev);
	};

	return (
		<Button onClick={handleSettings} disabled={disabled} template="darker_inner" className={twMerge(disabled ? "text-slate-800" : "", className)}>
			SETTINGS
		</Button>
	);
};

export default Settings;
