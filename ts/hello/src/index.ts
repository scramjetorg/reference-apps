import { DataStream } from "scramjet";
import { ReadableApp } from "@scramjet/types";

const mod: ReadableApp = function(_input) {
    this.logger.info("Sequence started");

    return DataStream.from(_input)
        .map((chunk) => {
            return `Hello ${chunk}!`;
        })
        .do(console.log);
};

export default mod;
