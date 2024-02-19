import { DataStream } from "scramjet";
import fs from "fs";

export default [
    function(_stream: any, generateUntil: number, outputFile: string) {
        const out =
            DataStream.from(
                async function*() {
                    let x = 0;

                    while (++x <= generateUntil) {
                        yield { id: x };
                    }
                })
                .map((data) => JSON.stringify(data) + "\n")
                .on("error", (e) => {
                    console.error("ERR", e.message);
                });

        out.pipe(fs.createWriteStream(outputFile));

        return Object.assign(out, { topic: "topic-generator", contentType: "text/plain" }
        );
    }
];
