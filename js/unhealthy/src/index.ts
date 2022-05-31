import { InertApp } from "@scramjet/types";

const mod = async function(_stream) {
    this.addMonitoringHandler(() => {
        return { healthy: false };
    });

    await new Promise(res => setTimeout(res, 1000));
} as InertApp;

export default mod;
