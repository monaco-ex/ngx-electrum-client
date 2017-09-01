import {Injectable, NgZone} from "@angular/core";
import { ElectrumClient } from "./electrum-client";

@Injectable()
export class ElectrumClientService {

  public setup = (port: number, host: string, protocol: string, options: any) =>
    new ElectrumClient(port, host, protocol, options)
}
