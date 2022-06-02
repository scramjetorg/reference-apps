/* eslint-disable no-console, no-extra-parens */
import { Streamable, TransformApp } from "@scramjet/types";
import { StringStream } from "scramjet";
import { PassThrough } from "stream";

const mod: (TransformApp | { provides: string, contentType: string})[] = [
    function(input: Streamable<any>) {
        const out = new PassThrough({ objectMode: true });
        (input as StringStream)
            .map((s: any) =>{
                out.write(`producer got: ${s}`)
            })
            .pipe(out);
        return Object.assign(out, { topic: "topic-test", contentType: "text/plain"})
    }
];

export default mod;
