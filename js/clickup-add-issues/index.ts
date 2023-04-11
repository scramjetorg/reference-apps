/* eslint-disable no-console */
import { Streamable, TransformApp } from "@scramjet/types";
import { StringStream } from "scramjet";
import { ClickUpClient } from "./clickup";

const mod: (TransformApp | { requires: string, contentType: string})[] = [
    { requires: "issue", contentType: "application/x-ndjson" },
    function(input: Streamable<any>) {
        const clickupClient = new ClickUpClient();

        const onError = (error: any) => { console.error(error); };

        (input as StringStream)
            .map((data) => {
                console.log(data);
                data = JSON.parse(data);
                clickupClient.sendRequest({
                    name:data.name,
                    description:data.description,
                    tags:data.tags
                });
            }).catch((error: any) => {
                onError(error);
            });

        return new Promise((_res, _rej) => {
            _rej = onError;
        });
    }
];

export default mod;
