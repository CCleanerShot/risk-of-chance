import Button from "@/app/components/UI/Button";
import UtilsSupabase from "@/common/utils/utils_supabase";
import React from "react";
import { twMerge } from "tailwind-merge";

interface SaveProps {
    disabled: boolean;
    className?: string;
}

const Save = ({ disabled, className }: SaveProps) => {
    const handleSave = () => {
        UtilsSupabase.Save(true);
    };

    return (
        <Button onClick={handleSave} disabled={disabled} template="darker_inner" className={twMerge(disabled ? "text-slate-800" : "", className)}>
            SAVE
        </Button>
    );
};

export default Save;
