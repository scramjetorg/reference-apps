"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scramjet = require("scramjet");
const JSONStream = require("JSONStream");
const fs = require("fs");
const mod = function (_input, ffrom = `${__dirname}/data.json`) {
    this.on("test", () => console.error("Got test event"));
    this.logger.info("Sequence started");
    return fs.createReadStream(ffrom)
        .on("end", () => {
        this.logger.info("File read end");
    })
        .pipe(JSONStream.parse("*"))
        .pipe(new scramjet.DataStream())
        .setOptions({ maxParallel: 1 })
        .do(() => new Promise(res => setTimeout(res, 500)))
        .map((names) => {
        return `Hello ${names.name}!\n`;
    })
        .do(console.log);
};
exports.default = mod;
//# sourceMappingURL=index.js.map