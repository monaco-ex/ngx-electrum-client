import {Component} from "@angular/core";
import { Client } from "./client";

export class ElectrumClient extends Client {

    public server = {
      banner: () =>
        this.request("server.banner", []),
      donation_address: () =>
        this.request("server.donation_address", []),
      peers: {
        subscribe: () =>
          this.request("server.peers.subscribe", []),
      },
      version: (clientName: string, protocolVersion: string) =>
        this.request("server.version", [clientName, protocolVersion]),
    };
    public blockchain = {
       address: {
         get_balance: (address: string) =>
           this.request("blockchain.address.get_balance", [address]),
         get_history: (address: string) =>
           this.request("blockchain.address.get_history", [address]),
         get_mempool: (address: string) =>
           this.request("blockchain.address.get_mempool", [address]),
         get_proof: (address: string) =>
           this.request("blockchain.address.get_proof", [address]),
         listunspent: (address: string) =>
           this.request("blockchain.address.listunspent", [address]),
      },
      block: {
        get_chunk: (index) =>
          this.request("blockchain.block.get_chunk", [index]),
        get_header: (height) =>
          this.request("blockchain.block.get_header", [height]),
      },
      estimatefee: (num: number) =>
        this.request("blockchain.estimatefee", [num]),
      headers: {
        subscribe: () =>
          this.request("blockchain.headers.subscribe", []),
      },
      numblocks: {
        subscribe: () =>
          this.request("blockchain.numblocks.subscribe", []),
      },
      relayfee: () =>
        this.request("blockchain.relayfee", []),
      transaction: {
        broadcast: (rawtx: string) =>
          this.request("blockchain.transaction.broadcast", [rawtx]),
        get: (txHash, height) =>
          this.request("blockchain.transaction.get", [txHash, height]),
        get_merkle: (txHash, height) =>
          this.request("blockchain.transaction.get_merkle", [txHash, height]),
      },
      utxo: {
        get_address: (txHash: string, index: number) =>
          this.request("blockchain.utxo.get_address", [txHash, index]),
      },
    };

    constructor(port: number, host: string, protocol: string, options: any) {
        super(port, host, protocol, options);
    }

    public onClose() {
        super.onClose();
        const list = [
            "server.peers.subscribe",
            "blockchain.numblocks.subscribe",
            "blockchain.headers.subscribe",
            "blockchain.address.subscribe",
        ];
        list.forEach((event) => this.subscribe.removeAllListeners(event));
    }
}
