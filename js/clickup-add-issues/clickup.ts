/* eslint-disable no-console */
import { request } from "https";
import { ClientRequest } from "http";
import * as cuSettings from "./cudata.json";

type CuRequestType = {
    name: string;
    description: string;
    tags: Array<string>;
}
export class ClickUpClient {
    listId: string;
    token: string;

    constructor(token:string) {
        this.listId = cuSettings.listId;
        this.token = token;
        console.log(token);
    }
    sendRequest(issue :CuRequestType) {
        const body = JSON.stringify({
            name: issue.name,
            description: issue.description,
            tags:issue.tags
        });
        const options = {
            hostname: "api.clickup.com",
            path: `/api/v2/list/${this.listId}/task`,
            port: 443,
            headers: {
                Authorization: this.token,
                "content-type": "application/json"
            },
            method: "POST",
        };
        const req:ClientRequest = request(options, (res) => {
            console.log("statusCode:", res.statusCode);
            console.log("headers:", res.headers);

            res.on("data", (d) => {
                process.stdout.write(d);
            });
        });

        req.on("error", (e) => {
            console.error(e);
        });
        req.write(body);
        req.end();
    }
}
