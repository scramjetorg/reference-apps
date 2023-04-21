import { ReadableApp } from "@scramjet/types";
import { defer } from "@scramjet/utility";
import { PassThrough } from "stream";

const output: PassThrough & { topic: string, contentType: string } = Object.assign(
    new PassThrough({ encoding:"utf-8" }), { topic: "self-starting-data", contentType: "text/plain" }
);
const app: ReadableApp<string> = async function(_stream,interval:number,sequenceNumber:number=0) {
    const hub = this.hub!;
    const instanceId = this.instanceId;
    const instanceClient = hub.getInstanceClient(instanceId);
    const seqId = await hub.getInstanceInfo(instanceId).then((res) => { return res.sequence; });
    const seqClient = hub.getSequenceClient(seqId);

    await defer(interval);

    this.logger.info(`starting sequence number ${sequenceNumber} with ${interval} ms interval `);
    output.push(`Starting with id: ${instanceId}\n`);

    await seqClient.start({ appConfig: { interval, sequenceNumber: sequenceNumber + 1 }});
    await instanceClient.kill({ removeImmediately:true });

    return output;
};

export default app;
