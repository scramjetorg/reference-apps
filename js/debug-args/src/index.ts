/* eslint-disable no-console */
import { ReadableApp } from "@scramjet/types";
import { PassThrough } from "stream";

type Arguments = string[]

const exp: ReadableApp<string, Arguments> = function(_stream, arg1, arg2) {
    const out = new PassThrough();
    const output = { "first_arg": arg1, "second_arg": arg2 };

    out.write(JSON.stringify(output));

    return out;
};

export default exp;
