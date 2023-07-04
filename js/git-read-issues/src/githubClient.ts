/* eslint-disable no-console */
import { Octokit } from "octokit";
import { Issue } from "./issue";
import { IObjectLogger } from "@scramjet/types/object-logger";
import * as ghSettings from "./ghdata.json";
import fetchOptions from "./fetchOptions";

const readLabel = "read";

export class GithubClient {
    repo: string = "";
    owner: string = "";
    apiKey: string;
    octokit: Octokit;
    logger: IObjectLogger;
    baseURL: string = "https://api.github.com/repos"
    URL: string = "";

    constructor(apiKey: string, logger: IObjectLogger) {
        this.apiKey = apiKey;
        this.logger = logger;
        this.octokit = new Octokit({
            auth: apiKey,
            log: console
        });
    }
    setRepo(repo: { owner:string, repo:string }) {
        this.owner = repo.owner;
        this.repo = repo.repo;
        this.URL = `${this.baseURL}/${repo.owner}/${repo.repo}`
    }

    private async gitHubFilter() {
        const res = await this.octokit.rest.issues.listForRepo({
            owner: this.owner,
            repo: this.repo,
            state: "open",
            issue_type: "issue"
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
        this.logger.info(`checking repo: ${repo.owner}/${repo.repo} ...`);
        this.owner = repo.owner;
        this.repo = repo.repo;
        const issuesArr: Issue[] = [];

        return this.gitHubFilter().then(async (result) => {
            result.map(async (e) => {
                if (typeof e.body === "string") {
                    this.logger.info(`found new issue "${e.title}" in: ${this.repo}`);
                    const entry = new Issue(e.number, e.title, e.body, this.repo, e.labels, this.owner);

                    issuesArr.push(entry);

                    await fetch(`${this.URL}/issues/${e.number}/labels`, fetchOptions("POST",this.apiKey,JSON.stringify({"labels": [readLabel]})))
                } else {
                    this.logger.info("found issue but its body was empty", e.title);
                }
            });

            return issuesArr;
        });
    }
    private async handShakeRequest(repo: { owner:string, repo:string }) {
        const account = await this.octokit.rest.users.getAuthenticated();

        if (account.status !== 200) {
            throw new Error("unable to get user info");
        } else {
            this.logger.info(`authenticated to github as ${account.data.login}`);
        }

        return this.octokit.rest.repos.get({
            owner: repo.owner,
            repo: repo.repo
        });
    }
    public async handShake(): Promise<void[]> {
        return Promise.all(ghSettings.repos.map(async (e) => {
            try {
                await this.handShakeRequest(e);
            } catch (error:any) {
                if (error.status && error.response) {
                    this.logger.error(`got status: ${error.status} from: ${error.response.url}`);
                } else {
                    this.logger.error("handshake error", error);
                }
            }
        }));
    }
}
