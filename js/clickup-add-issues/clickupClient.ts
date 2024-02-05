/* eslint-disable no-console */
import { request } from "https";
import { ClientRequest } from "http";
import * as cuSettings from "./cudata.json";
import { IObjectLogger } from "@scramjet/types";

type stringToValue = {
    [key: string]: string[]; 
};

type CuRequestType = {
    name: string;
    description: string;
    source: string;
    tags: Array<string>;
}

export class ClickupClient {
    listId: string;
    token: string;
    tagsMap: stringToValue;
    logger: IObjectLogger;

    constructor(token: string, config: any, logger: IObjectLogger) {
        this.listId = cuSettings.listId;
        this.token = token;
        this.tagsMap = config;
        this.logger = logger; 
        this.logger.info(`Read token ${this.token}`);
        this.logger.info(`Read config ${JSON.stringify(config)}`);
    }
    sendRequest(issue :CuRequestType) {
        const body = JSON.stringify({
            name: issue.name,
            tags: this.tagsMap[issue.source] || [],
            description: issue.description, 
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

        const req: ClientRequest = request(options, (res) => {
            this.logger.info(`statusCode: ${res.statusCode}`);
            this.logger.info(`headers: ${res.headers}`);

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
