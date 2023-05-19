import { Octokit } from "octokit";
import { Issue } from "./issue";

const readLabel = "read";

export class GithubClient {
    repo: string = "";
    owner: string = "";
    apiKey: string;
    octokit: Octokit;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.octokit = new Octokit({
            auth: apiKey
        });
    }
    setRepo(repo: { owner:string, repo:string }) {
        this.owner = repo.owner;
        this.repo = repo.repo;
    }
    private async gitHubFilter() {
        const res = await this.octokit.rest.issues.listForRepo({
            owner: this.owner,
            repo: this.repo,
            state: "open"
        });

        return res.data.filter(
            (elem) => {
                let hasReadLabel = false;

                elem.labels.forEach((e) => {
                    if (typeof e !== "string" && "name" in e && e.name === "read") {
                        hasReadLabel = true;
                    }
                });

                return !hasReadLabel;
            }
        );
    }

    public async search(repo:{owner:string, repo:string}): Promise<Issue[]> {
        this.owner = repo.owner;
        this.repo = repo.repo;
        const issuesArr: Issue[] = [];

        return this.gitHubFilter().then(async (result) => {
            await result.map(async (e) => {
                if (typeof e.body === "string") {
                    const entry = new Issue(e.number, e.title, e.body, this.repo, e.labels, this.owner);

                    issuesArr.push(entry);

                    await this.octokit.rest.issues.addLabels({
                        owner: this.owner,
                        repo: this.repo,
                        issue_number: e.number,
                        labels: [readLabel]
                    });
                }
            });

            return issuesArr;
        });
    }
}
