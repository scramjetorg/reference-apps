import { Octokit } from "octokit";
import { Endpoints } from "@octokit/types";
import * as data from "../ghdata.json";

type listUserReposResponse = Endpoints["GET /repos/{owner}/{repo}/issues"]["response"];
const readLabel = "read";

class issue {
    url:string;
    title:string;
    body:string;
    repo:string;
    labels:Array<string|Object>;
    constructor(id:number, title:string, body:string, repo:string, labels:Array<string|object>,owner:string) {
        this.url = `https://github.com/${owner}/${repo}/issues/${id}`;
        this.title = title;
        this.body = body;
        this.repo = repo;
        this.labels = labels;
    }
}
export class GhRequest {
    repo:string;
    owner:string;
    apiKey:string;
    constructor(settings:{repo:string,owner:string},apiKey:string) {
        this.repo = settings.repo;
        this.owner = settings.owner;
        this.apiKey=apiKey;
    }
    octokit:Octokit = new Octokit({
        auth: data.auth,
    });
    gitRequestPromise() : Promise<listUserReposResponse> {
        return this.octokit.rest.issues.listForRepo({
            owner: this.owner,
            repo: this.repo,
            state: "open",
        });
    }
    async gitLabel() {
        const gitRequestResponse: listUserReposResponse = await this.gitRequestPromise();

        gitRequestResponse.data.forEach(async (e) => {
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
        return await this.gitLabel()
            .then((res) => {
                const result = res.filter((elem) => !elem.labels.filter((e) => typeof e !== "string" && "name" in e && e.name === "read").length);

                return result;
            });
    }
    async search():Promise<Array<issue>> {
        const issuesArr:Array<issue> = [];

        await this.gitHubFilter().then((result) => result.map((e) => {
            if(typeof e.body === "string") {
                const entry = new issue(e.number, e.title, e.body, this.repo, e.labels,this.owner);
                issuesArr.push(entry);
            }

        }));
        return issuesArr;
    }
}
