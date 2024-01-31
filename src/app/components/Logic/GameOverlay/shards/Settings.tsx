import Button from "@/app/components/UI/Button";
import UtilsSupabase from "@/common/utils/utils_supabase";
import React from "react";
import { twMerge } from "tailwind-merge";

interface SettingsProps {
	className?: string;
}

const Settings = ({ className }: SettingsProps) => {
	const handleSettings = () => {};

	return (
		<Button onClick={handleSettings} template="darker_inner" className={className}>
			SETTINGS
		</Button>
	);
};

export default Settings;
