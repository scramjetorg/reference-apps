import { InertApp } from "@scramjet/types";

const mod = async function(_stream) {
    this.addStopHandler(async () => {
        process.stdout.write("Cleaning up... ");
        await new Promise(f => setTimeout(f, 1000));
        process.stdout.write("Cleanup done.\n");
    });

    await new Promise(f => setTimeout(f, 10**9));
} as InertApp;

export default mod;
