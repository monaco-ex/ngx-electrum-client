import {ElectrumClient} from './electrum-client';

describe('Test:', () => {
  it('Constructor', () => {
    new ElectrumClient(50001, "electrumx.tamami-foundation.org", "tcp", {});
  });
