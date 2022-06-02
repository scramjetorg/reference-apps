import { InertApp } from "@scramjet/types";

const mod = async function(_stream) {
    this.on("test-event", async (message ) => {
        this.emit("test-response", `reply to ${message}`)
    });

    await new Promise(res => setTimeout(res, 60000));
} as InertApp;

export default mod;
