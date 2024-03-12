/* eslint-disable consistent-return */
import { AppConfig, AppContext } from "@scramjet/types";
import { createReadStream } from "fs";
import { PassThrough } from "stream";
import * as crypto from "crypto";

const mod = [
    /**
     * @param _stream - input
     * @param filePath - path to binary file
     * @returns output
     */
    async function(this: AppContext<AppConfig, any>, _stream: any, filePath: string = `${__dirname}/random.bin`) {
        this.logger.info("Sequence started");
        const ps = new PassThrough({ encoding: "binary" });

        try {
            const stream = createReadStream(filePath);
            const hash = crypto.createHash("sha256");

            stream.pipe(ps);

            stream.on("data", (data) => {
                hash.update(data);
            });

            stream.on("end", () => {
                const checksum = hash.digest("hex");

                console.log(checksum);
                this.logger.info(`${filePath} checksum written to stdout: ${checksum}`);
            });

            return ps;
        } catch (e: any) {
            this.logger.error(e);
        }
    }
];

export = mod;
