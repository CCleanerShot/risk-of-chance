"use client";

import React, { useRef } from "react";
import Modal from "@/app/components/UI/Modal/Modal";
import GlobalStore from "@/common/global_store";
import Button from "@/app/components/UI/Button";
import UtilsSupabase from "@/common/utils/utils_supabase";

const ModalCreateUser = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const onClick = async () => {
        const session = GlobalStore.getFromStore("supabaseSession").session;

        if (!session?.user.id) {
            GlobalStore.Update("updateMessage", "updateMessage", { msg: "Session is missing when expected, consider refreshing the page.", type: "error" });
            return;
        }

        if (!inputRef?.current) {
            GlobalStore.Update("updateMessage", "updateMessage", { msg: "Unexpected error when checking the input. Contact the developer if this persists.", type: "error" });
            return;
        }

        const { error } = await UtilsSupabase.GetQuery("createUser").callQuery(session?.user.id, inputRef.current?.value);

        if (error) {
            GlobalStore.Update("updateMessage", "updateMessage", { msg: "Unexpected error when creating your user. Contact the developer if this persists.", type: "error" });
            return;
        }

        GlobalStore.Update("username", "username", inputRef.current.value);
        GlobalStore.Update("modalCreateUser", "isOpened", false);
    };

    return (
        <Modal alignment={{ x: "middle", y: "middle" }} listenTo="modalCreateUser" className="min-h-30 min-w-40">
            <div className="flex flex-col items-center gap-4 m-2">
                <h2 className="text-white text-center underline">
                    You seem to be a first time player!
                    <br />
                    Enter your username below:
                </h2>
                <div className="flex gap-2">
                    <label htmlFor="username" className="text-white">
                        Username
                    </label>
                    <input ref={inputRef} id="username" type="text" />
                </div>
                <Button template="darker_inner" onClick={onClick} className="text-white">
                    Submit Username
                </Button>
            </div>
        </Modal>
    );
};

export default ModalCreateUser;
