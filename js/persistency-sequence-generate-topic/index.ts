/* eslint-disable no-console */
import { PassThrough, Readable } from "stream";
import { randomBytes } from "crypto";
import { TransformApp } from "@scramjet/types";

const exp: (TransformApp | { provides: string; contentType: string })[] = [
    async function(_input, executionTime: number = 1 * 10 * 1000, dataAmount: number = 16 * 1000) {
        const out = new PassThrough();
        const dataSize = 16;
        const intervalDelay = executionTime / (dataAmount / dataSize);

        async function* gen() {
            let a = 0;
            let tempDataAmount = dataAmount;
            const startTime = Date.now();
            
            console.log(`Generating ${dataSize} bytes every ${intervalDelay}ms ...`);

            while (tempDataAmount >= dataSize) {
                a++;
                tempDataAmount -= dataSize;

                yield Buffer.concat([Buffer.from(new Uint32Array([a])), randomBytes(dataSize - 4)]);

                await new Promise<void>((res) => {
                    const now = Date.now();

                    while (now + intervalDelay >= Date.now()) {
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

        this.on("new-test-start", () => {
            Readable.from(gen()).pipe(out, { end: false });
        });

        return Object.assign(out, { topic: "persistance", contentType: "application/octet-stream" });
    }
];

export default exp;
