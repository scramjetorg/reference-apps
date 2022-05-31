import { ReadableApp } from "@scramjet/types";

class TestException extends Error {
    constructor(message: string | undefined) {
        super(message);
        this.name = "TestException";
     }
}

const mod: ReadableApp = function() {
    throw new TestException("This exception should appear on stderr");
};

export default mod;
