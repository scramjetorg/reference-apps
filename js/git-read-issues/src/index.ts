/* eslint-disable no-console */
import { GithubClient } from "./githubClient";
import { AppContext, ReadableApp } from "@scramjet/types";
import * as ghSettings from "./ghdata.json";
import { PassThrough } from "stream";
import { defer } from "@scramjet/utility";

function labelHelper(labels: any[], repo: string): Array<string> {
    return labels
        .filter(label => label.name === "read" || label === "read")
        .concat([repo]);
}

const output: PassThrough & { topic: string; contentType: string } = Object.assign(
    new PassThrough({ encoding: "utf-8" }),
    {
        topic: "issue",
        contentType: "application/x-ndjson"
    }
);

async function main(this:AppContext<any, any>, ghClient: GithubClient) {
    this.logger.info("Reading issues started");
    await Promise.all(ghSettings.repos.map(async (e) => ghClient.search(e))).then((reposIssues) =>
        reposIssues.flat().forEach(async (issue) => {
            if (issue !== undefined) {
                this.logger.info("pushing new issue to topic", issue);
                const newIssue = JSON.stringify({
                    name: issue.title,
                    description: issue.body,
                    source: issue.repo,
                    tags: labelHelper(issue.labels, issue.repo),
                }) + "\n";

                if (!output.write(newIssue)) {
                    await new Promise(res => output.once("drain", res));
                }
                await defer(100);
            }
        })
    ).catch((e) => {
        this.logger.error("main error", e);
    });
}

const app: ReadableApp<any> = async function(_stream, apiKey: string) {
    const interval: number = 1000 * 60;
    const ghClient = new GithubClient(apiKey, this.logger);

    this.logger.info("checking all repositories...");
    try {
        await ghClient.handShake();
    } catch (error) {
        this.logger.error("handshake failed", error);
        throw new Error("failed to get repository details, please check your key or repo details");
    }
    this.logger.info("Github repository checks and handshake went successful");

    await main.call(this, ghClient);

    setInterval(async () => {
        await main.call(this, ghClient);
    }, interval);

    return output;
};

export default app;
