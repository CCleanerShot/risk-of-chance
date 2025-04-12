"use effect";

import React, { useEffect, useState } from "react";
import { GameStatusTypes } from "@/types";
import GlobalStore from "@/common/global_store";
import Battle from "./shards/Battle";
import Results from "./shards/Results";
import Start from "./shards/Start";
import Exit from "./shards/Exit";
import Shop from "./shards/Shop";
import UtilsGame from "@/common/utils/utils_game";
import UtilsSupabase from "@/common/utils/utils_supabase";
import Username from "@/app/components/Logic/Username/Username";

const Game = () => {
    const [gameScreen, setGameScreen] = useState<GameStatusTypes>("start");

    const listenToGame = () => {
        const game = GlobalStore.getFromStore("game").game;
        setGameScreen(game.gameStatus);

        if (GlobalStore.getFromStore("supabaseSession").session !== null) {
            UtilsSupabase.Save(false);
        }
    };

    useEffect(() => {
        UtilsGame.Initialize();
        GlobalStore.AddListener("game", listenToGame);

        return () => {
            GlobalStore.RemoveListener("game", listenToGame);
        };
    }, []);

    const ScreenComponent = () => {
        switch (gameScreen) {
            case "battle":
                return <Battle />;
            case "results":
                return <Results />;
            case "start":
                return <Start />;
            case "exit":
                return <Exit />;
            case "shop":
                return <Shop />;
        }
    };

    return (
        <div className="flex-1 flex justify-center items-center">
            {ScreenComponent()}
            <Username />
        </div>
    );
};

export default Game;
