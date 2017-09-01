"use strict";
/*
 * This code from `electrum-client` npm package.
 */

export const makeRequest = (method0, params0, id0) =>
  JSON.stringify({
    id : id0,
    jsonrpc : "2.0",
    method : method0,
    params : params0,
  });

const createRecuesiveParser = exports.createRecuesiveParser = (maxDepth, delimiter) => {
  const MAX_DEPTH = maxDepth;
  const DELIMITER = delimiter;
  const recursiveParser = (n, buf, callback) => {
    if (buf.length === 0) {
      return { buffer: buf, code: 0 };
    }
    if (n > MAX_DEPTH) {
      return { buffer: buf, code: 1 };
    }
    const xs = buf.split(DELIMITER);
    if (xs.length === 1) {
    return { buffer: buf, code: 0 };
    }
    callback(xs.shift(), n);
    return recursiveParser(n + 1, xs.join(DELIMITER), callback);
  };
  return recursiveParser;
};

export const createPromiseResult = (resolve, reject) => {
    return (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    };
};

export class MessageParser {
    private buffer: string;
    private callback: any; /* closure */
    private recursiveParser: any; /* closure */

    constructor(callback) {
        this.buffer = "";
        this.callback = callback;
        this.recursiveParser = createRecuesiveParser(20, "\n");
    }

    public run(chunk) {
        this.buffer += chunk;
        while (true) {
            const res = this.recursiveParser(0, this.buffer, this.callback);
            this.buffer = res.buffer;
            if (res.code === 0) {
                break;
            }
        }
    }
}
