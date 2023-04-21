import { Octokit } from "octokit";
import { ListUserReposResponse } from "./types/types";
import { Issue } from "./issue";

const readLabel = "read";

export class GithubClient {
    repo: string;
    owner: string;
    apiKey: string;
    octokit: Octokit;

    constructor(settings: { repo: string; owner: string }, apiKey: string) {
        this.repo = settings.repo;
        this.owner = settings.owner;
        this.apiKey = apiKey;
        this.octokit = new Octokit({
            auth: apiKey
        });
    }

    gitRequestPromise(): Promise<ListUserReposResponse> {
        return this.octokit.rest.issues.listForRepo({
            owner: this.owner,
            repo: this.repo,
            state: "open"
        });
    }

    async gitLabel() {
        const gitRequestResponse: ListUserReposResponse = await this.gitRequestPromise();

        gitRequestResponse.data.forEach(async (e:any) => {
            await this.octokit.rest.issues.addLabels({
                owner: this.owner,
                repo: this.repo,
                issue_number: e.number,
                labels: [readLabel]
            });
        });

        return gitRequestResponse.data;
    }

    async gitHubFilter() {
        return await this.gitLabel().then((res) => {
            const result = res.filter(
                (elem: any) => !elem.labels.filter((e: any) => typeof e !== "string" && "name" in e && e.name === "read").length
            );

            return result;
        });
    }

    async search(): Promise<Array<Issue>> {
        const issuesArr: Array<Issue> = [];

        await this.gitHubFilter().then((result) =>
            result.map((e: any) => {
                if (typeof e.body === "string") {
                    const entry = new Issue(e.number, e.title, e.body, this.repo, e.labels, this.owner);

                    issuesArr.push(entry);
                }
            })
        );

        return issuesArr;
    }
}
