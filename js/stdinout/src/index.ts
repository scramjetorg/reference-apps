import { StringStream } from "scramjet";
import { ReadableApp } from "@scramjet/types";

const mod: ReadableApp = function(_input) {
    this.logger.trace("Start");

    return StringStream
        .from(process.stdin)
        .map((chunk) => {
            return `Got on stdin: ${chunk}`;
        })
        .do(
            async (chunk: any) => {
                process.stdout.write(chunk);
            }
        )
};

export default mod;
