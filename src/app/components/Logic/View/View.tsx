"use client";

import React, { useEffect, useState } from "react";
import GlobalStore from "@/common/global_store";
import GetStarted from "./shards/GetStarted";
import Game from "@/app/components/Logic/Game/Game";
import Corner from "@/app/components/UI/Corner";
import { SizeTypes, StatusColorTypes, SupabaseSessionStatusTypes } from "@/types";
import LoadingIcon from "@/app/components/UI/LoadingIcon";
import toast from "react-hot-toast";
import GameOverlay from "../GameOverlay/GameOverlay";
import UtilsSupabase from "@/common/utils/utils_supabase";

const View = () => {
    const cornerSize: SizeTypes = "medium";
    const [color, setColor] = useState<StatusColorTypes>("red");
    const [status, setStatus] = useState<SupabaseSessionStatusTypes>("loading");

    const listenToSupabaseSession = () => {
        const status = GlobalStore.getFromStore("supabaseSession").status;
        switch (status) {
            case "loading":
            case "none":
                setColor("red");
                break;
            case "exists":
            case "valid":
                setColor("green");
                break;
            case "guest":
                setColor("yellow");
                break;
        }

        setStatus(status);
    };

    const listenToUpdateMessage = () => {
        const { msg, type } = GlobalStore.getFromStore("updateMessage").updateMessage;
        switch (type) {
            case "error":
                toast.error(msg);
                break;
            case "warn":
                toast.error(msg);
                break;
            case "log":
                toast.success(msg);
                break;
        }
    };

    useEffect(() => {
        async function execute() {
            GlobalStore.AddListener("supabaseSession", listenToSupabaseSession);
            GlobalStore.AddListener("updateMessage", listenToUpdateMessage);
            const supabaseClient = GlobalStore.getFromStore("supabaseClient").supabaseClient;
            const session = (await supabaseClient.auth.getSession()).data.session;

            if (!session) {
                GlobalStore.Update("supabaseSession", "status", "none");
            } else {
                GlobalStore.Update("supabaseSession", "status", "exists");
                GlobalStore.Update("supabaseSession", "session", session);
                await UtilsSupabase.Load();
            }
        }

        execute();

        return () => {
            GlobalStore.RemoveListener("supabaseSession", listenToSupabaseSession);
            GlobalStore.RemoveListener("updateMessage", listenToUpdateMessage);
        };
    }, []);

    const PageComponent = () => {
        switch (status) {
            case "exists":
            case "guest":
            case "valid":
                return (
                    <>
                        <Game />
                        <GameOverlay />
                    </>
                );
            case "loading":
                return <LoadingIcon color="red" size={30} durationMillseconds={500} />;
            case "none":
                return <GetStarted />;
        }
    };

    return (
        <div className="bg-slate-700 h-screen flex flex-col text-white">
            <div className="flex justify-between bg-slate-700">
                <Corner color={color} facing="down-right" size={cornerSize} />
                <Corner color={color} facing="down-left" size={cornerSize} />
            </div>
            <div className="flex-1 flex justify-center items-center h-full w-full">{PageComponent()}</div>
            <div className="flex justify-between bg-slate-700">
                <Corner color={color} facing="up-right" size={cornerSize} />
                <Corner color={color} facing="up-left" size={cornerSize} />
            </div>
        </div>
    );
};

export default View;
