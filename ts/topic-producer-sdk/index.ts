import { AppConfig, AppContext } from "@scramjet/types";
import { createReadStream } from "fs";
import { PassThrough } from "stream";

const mod = [
    async function(this: AppContext<AppConfig, any>, _input: any) {
        this.logger.info("Sequence topic-producer started, sending data to topic 'test'...");
        const ps = new PassThrough();
        const stream = this.hub.sendTopic(
            "test",
            ps
        );

        createReadStream(`${__dirname}/data.json`).pipe(ps);

        await stream;

        return new Promise(() => {});
    }
];

export default mod;
