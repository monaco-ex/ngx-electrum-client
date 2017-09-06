"use strict";
/*
 * This code from `electrum-client` npm package.
 */

import {Observable, Subject } from "rxjs";

import { MessageParser } from "./util";
import { makeRequest } from "./util";
import { createPromiseResult } from "./util";

import { initSocket } from "./init_socket";

export class Client {

    protected subscribe: any;

    private id: number;
    private port: number;
    private host: string;
    private subjectQueue: any;
    private conn: any;
    private mp: MessageParser;
    private status: boolean;

    constructor(port, host, protocol = "tcp", options = void 0) {
        const EventEmitter = require("events").EventEmitter;
        this.id = 0;
        this.port = port;
        this.host = host;
        this.subjectQueue = {};
        this.subscribe = new EventEmitter();
        this.conn = initSocket(this, protocol, options);
        this.mp = new MessageParser((body, n) => {
            this.onMessage(body, n);
        });
        this.status = false;
    }

    public connect() {
        if (this.status) {
            return Promise.resolve();
        }
        this.status = true;
        return new Promise((resolve, reject) => {
            const errorHandler = (e) => reject(e);
            this.conn.connect(this.port, this.host, () => {
                this.conn.removeListener("error", errorHandler);
                resolve();
            });
            this.conn.on("error", errorHandler);
        });
    }

    public close() {
        if (!this.status) {
            return;
        }
        this.conn.end();
        this.conn.destroy();
        this.status = false;
    }

    public request(method, params) {
        if (!this.status) {
            return Promise.reject(new Error("ESOCKET"));
        }
        const id = ++this.id;
        const content = makeRequest(method, params, id);
        this.subjectQueue[id] = new Subject<any>();
        this.conn.write(content + "\n");
        return this.subjectQueue[id].asObservable();
    }

    public response(msg) {
        const subject = this.subjectQueue[msg.id];
        if (subject) {
            delete this.subjectQueue[msg.id];
            if (msg.error) {
                subject.error(msg.error);
            } else {
                subject.next(msg.result);
            }
        } else {
            console.error("Inconsistent subjectQueue: #{msg.id}");
        }
    }

    public onMessage(body, n) {
        const msg = JSON.parse(body);
        if (msg instanceof Array) {
            // don"t support batch request
        } else {
            if (msg.id !== void 0) {
                this.response(msg);
            } else {
                this.subscribe.emit(msg.method, msg.params);
            }
        }
    }

    public onConnect() {
        /* probably overridden */
    }

    public onClose() {
        Object.keys(this.subjectQueue).forEach((key) => {
            this.subjectQueue[key].complete();
            delete this.subjectQueue[key];
        });
    }

    public onRecv(chunk) {
        this.mp.run(chunk);
    }

    public onEnd() {
        /* probably overridden */
    }

    public onError(e) {
        /* probably overridden */
    }
}
