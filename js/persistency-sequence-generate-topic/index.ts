/* eslint-disable no-console */
import { PassThrough, Readable } from "stream";
//import { randomBytes } from "crypto";
import { TransformApp } from "@scramjet/types";

const exp: (TransformApp | { provides: string; contentType: string })[] = [
    async function(_input, executionTime: number = 3600 * 1000 / 60, dataAmount: number = 1024 * 1024 * 512) {
        const out = new PassThrough();
        const dataSize = 17;
        const intervalDelay = executionTime / (dataAmount / dataSize);

        async function* gen() {
            let a = 0;
            let tempDataAmount = dataAmount;
            const startTime = Date.now();

            console.log(`Generating ${dataSize} bytes every ${intervalDelay}ms ...`);

            while (tempDataAmount >= dataSize) {
                a++;

                const tsBuffer = Buffer.alloc(8);

                tsBuffer.writeBigUInt64BE(BigInt(Date.now()));

                const outString = tsBuffer.toString("hex") + "\n";

                tempDataAmount -= outString.length;

                yield outString;

                await new Promise<void>((res) => {
                    const now = Date.now();

                    while (now + intervalDelay > Date.now()) {
                        // noop
                    }

                    res();
                });
            }

            if (dataAmount > 0) {
                yield new Uint8Array(dataAmount).fill(0);
            }

            console.log(`Finished in: ${(Date.now() - startTime).toString()} ms. Bytes generated: ${a} x ${dataSize} + ${dataAmount} = ${a * dataSize + dataAmount}`);
        }

        this.on("start", () => {
            Readable.from(gen()).pipe(out, { end: false });
        });

        return Object.assign(out, { topic: "persistance", contentType: "application/octet-stream" });
    }
];

export default exp;
