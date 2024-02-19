export class Issue {
    url: string;
    title: string;
    body: string;
    repo: string;
    labels: Array<string | Object>;

    constructor(id: number, title: string, body: string, repo: string, labels: Array<string | object>, owner: string) {
        this.url = `https://github.com/${owner}/${repo}/issues/${id}`;
        this.title = title;
        this.body = body;
        this.repo = repo;
        this.labels = labels;
    }
}
