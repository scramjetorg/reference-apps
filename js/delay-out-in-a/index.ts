import { AppConfig, AppContext } from "@scramjet/types";
import { DataStream } from "scramjet";

const rht = require("./real-hrtime.node");

export default [
    /**
     * This Sequence is responsible for generating and sending timestamps as a DataStream to the to topic named "delay-test".
     * Timestamps are generated using real-hrtime.node module
     *
     * @param {AppContext} this - Application context
     * @param {any}_stream - A dummy input stream (not used)
     * @param {number} timesOfExecution - Number of times the measurement will be executed (default: 12000)
     * @param {number} waitToStart - Number of milliseconds to wait before starting the measurement (default: 20000)
     * @returns {DataStream} - A DataStream stream containing the generated timestamps, stream is assigned to topic "delay-test"
     */
    function(this: AppContext<AppConfig, any>, _stream: any, timesOfExecution = 12000, waitToStart = 20000) {
        console.log(`Testing ${timesOfExecution} samples after ${waitToStart} ms`);

        return Object.assign(
            DataStream.from(
                async function* () {
                    await new Promise(res => setTimeout(res, waitToStart));

                    let x = 0;

                    while (++x <= timesOfExecution) {
                        await new Promise(res => setTimeout(res, 10));
                        yield { i: x };
                    }

                    console.log("Done", x);
                })
                .map(
                    () => rht.stringified() + "\n"
                )
                .on("error", (e) => { this.logger.error("ERR", e.message); }),
            { topic: "delay-test", contentType: "application/x-ndjson" }
        );
    }
];
