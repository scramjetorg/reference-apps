/* eslint-disable no-console */
import { AppConfig, AppContext } from "@scramjet/types";
import { PassThrough } from "stream";

const mod = [
    async function(this: AppContext<AppConfig, any>, _input: any) {
        this.logger.info("Sequence topic-consumer started, awaiting for topic...");
        const ps = new PassThrough();
        const getTopic = await this.hub.getTopic("test");

        getTopic.on("data", (chunk: Buffer) => {
            const chunkStr = chunk.toString();

            console.log(chunkStr);
            ps.write(chunkStr);
        });
        return ps;
    }
];

export default mod;
