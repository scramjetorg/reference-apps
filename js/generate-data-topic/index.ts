/* eslint-disable no-console */
import { Readable, PassThrough } from "stream";
import { randomBytes } from "crypto";
import { TransformApp } from "@scramjet/types";

const exp: (TransformApp | { provides: string, contentType: string})[] = [
    async function(_input, executionTime: number = 10000) {
        const out = new PassThrough();

        async function * generate() {
            const startTime = new Date().getTime();
            const endTime = startTime + executionTime;
            const durationInMs = endTime - startTime;
            const duration = new Date(durationInMs).toISOString().substr(11, 8);

            while (new Date().getTime() < endTime) {
                yield Buffer.from(
                    Buffer.concat([
                        Buffer.from(Date.now().toString()), randomBytes(115)
                    ])
                );
            }

            console.log(`Start time: ${new Date(startTime).toISOString().substr(11,8)}`);
            console.log(`End time: ${new Date(endTime).toISOString().substr(11,8)}`);
            console.log(`Duration time: ${duration}`);
        }

        this.on("new-test-start", () => {
            Readable.from(generate()).pipe(out);
        });
        
        return Object.assign(out, { topic: "topic-test", contentType: "application/octet-stream" });
    }
];

export default exp;
