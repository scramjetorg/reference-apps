/* eslint-disable no-loop-func */
/**
 * @typedef {import("@scramjet/types").InertFunction<[], {x: number}>} InertApp
 * @typedef {import("@scramjet/types").AppContext} AppContext
 */

/**
 * An inert app that is just a function (not wrapped)
 *
 * @type {InertApp}
 * @param _stream - dummy input stream
 */
module.exports = async function(_stream) {
    const data = this.initialState;

    let x = data && data.x || 0;

    this.addStopHandler(() => this.save({ x }));

    while (++x < 5) {
        console.log({ x: x });
        await new Promise(res => setTimeout(res, 1000));
    }
};
