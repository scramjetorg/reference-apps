import { GithubClient } from "./githubClient";
import { ReadableApp } from "@scramjet/types";
import * as ghSettings from "../ghdata.json";
import { PassThrough } from "stream";

function labelHelper(labels: any[], repo: string): Array<string> {
    return labels
        .reduce((acc, c) => c !== "read" && c.name !== "read" ? acc.concat([c.name]) : acc, [])
        .concat([repo]);
}

const output: PassThrough & { topic: string; contentType: string } = Object.assign(
    new PassThrough({ encoding: "utf-8" }),
    {
        topic: "issue",
        contentType: "application/x-ndjson"
    }
);

async function main(apiKey: string) {
    await Promise.all(ghSettings.repos.map(async (e) => new GithubClient(e, apiKey).search())).then((reposIssues) =>
        reposIssues.flat().forEach((issue) => {
            if (issue !== undefined) {
                output.write(
                    JSON.stringify({
                        name: issue.title,
                        description: issue.body,
                        tags: labelHelper(issue.labels, issue.repo)
                    }) + "\n"
                );
            }
        })
    );
}

const app: ReadableApp<any> = async function (_stream, interval: number = 1000 * 30, apiKey: string) {
    await main(apiKey);

    setInterval(async () => {
        await main(apiKey);
    }, interval);

    return output;
};

export default app;
