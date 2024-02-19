/* eslint-disable no-console, no-extra-parens */
import { Streamable, TransformApp } from "@scramjet/types";
import { StringStream } from "scramjet";
import { PassThrough } from "stream";

const mod: (TransformApp | { requires: string, contentType: string})[] = [
    { requires: "topic-test", contentType: "text/plain" },
    function(input: Streamable<any>) {
        const out = new PassThrough({ objectMode: true });

        (input as StringStream)
            .map((s: any) => `consumer got: ${s}\n`)
            .pipe(out);

        return out;
    }
];

export default mod;
