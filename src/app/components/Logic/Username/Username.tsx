import H1 from "@/app/components/UI/H1";
import GlobalStore from "@/common/global_store";
import React, { useEffect, useState } from "react";

const Username = () => {
    const [username, setUsername] = useState(GlobalStore.getFromStore("username").username);

    const listenToUsername = () => {
        const newUsername = GlobalStore.getFromStore("username").username;
        setUsername(newUsername);
    };

    useEffect(() => {
        GlobalStore.AddListener("username", listenToUsername);

        return () => {
            GlobalStore.RemoveListener("username", listenToUsername);
        };
    }, []);

    return (
        <div className="absolute bottom-0">
            <H1>Hello, {username}!</H1>
        </div>
    );
};

export default Username;
