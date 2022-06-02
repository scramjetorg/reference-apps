import { ReadableApp } from "@scramjet/types";

const mod: ReadableApp = async function() {
    return await new Promise(f => setTimeout(f, 10**9));
};

export default mod;
