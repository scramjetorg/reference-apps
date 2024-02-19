import { AppConfig, AppContext, Streamable } from "@scramjet/types";
import { StringStream } from "scramjet";

const rht = require("./real-hrtime.node");

const CUTOFF = 2000;
const diffs: bigint[] = [];
let minDiff = BigInt(Number.MAX_SAFE_INTEGER);
let maxDiff = BigInt(Number.MIN_SAFE_INTEGER);

const bigIntMax = (...args: bigint[]) => args.reduce((m, e) => e > m ? e : m);
const bigIntMin = (...args: bigint[]) => args.reduce((m, e) => e < m ? e : m);

/**
 * This Sequence calculates the time differences between received timestamps and the local timestamp.
 * It performs statistical analysis on the differences and returns the results as a JSON string.
 *
 * @param {AppContext} this - Application context
 * @param {Streamable} input - Input stream containing the timestamps to analyze
 * @param {number} timesOfExecution - Number of times the analysis should be performed (default: 12000)
 * @returns {Promise<string>} - Promise that resolves to a JSON string containing the analysis results
 */
const exp: [
    { requires: string, contentType: string},
    (this: AppContext<AppConfig, any>, input: Streamable<any>) => Promise<string>
] = [
    { requires: "delay-test", contentType: "application/x-ndjson" },

    async function(input: Streamable<any>, timesOfExecution = 12000) {
        let h: bigint = BigInt(0);
        let diff = BigInt(0);
        let i = 1;

        await (input as StringStream)
            .while(o => {
                // Get the current local timestamp
                h = rht.bigint();
                // Calculate the difference between local timestamp and received timestamp
                diff = h - BigInt(o);

                if (diff < 0) {
                    this.logger.warn(`Package has been teleported in time! (${h.toString()} is less than ${BigInt(o.ts).toString()} at entry ${o.i}: ${o}) or machines time mismatch.`);
                }

                diffs.push(diff);

                return i++ < timesOfExecution;
            })
            .catch((e: any) => { console.log(e); })
            .run();

        this.logger.trace("Instance finished, total entries:", diffs.length);

        // Remove the initial cutoff entries from the differences array
        diffs.splice(0, CUTOFF);

        // calculate the sum of all differences in the diffs array
        // update the minimum and maximum differences.
        const sum: bigint = diffs
            .reduce(
                (a, b) => {
                    minDiff = bigIntMin(minDiff, b);
                    maxDiff = bigIntMax(maxDiff, b);

                    return b + a;
                }, BigInt(0)
            );

        return JSON.stringify({
            units: "ns",
            avg: parseInt(((sum / BigInt(diffs.length))).toString(), 10), // Calculate the average difference
            total: diffs.length, // Total number of differences
            max: parseInt(maxDiff.toString(), 10), // Maximum difference
            min: parseInt(minDiff.toString(), 10) // Minimum difference
        });
    }
];

export default exp;
