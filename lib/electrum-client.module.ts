import { ModuleWithProviders, NgModule } from "@angular/core";
import { ElectrumClientService } from "./electrum-client.service";

@NgModule({
    declarations: [],
    entryComponents: [],
    exports: [],
    imports: [],
    providers: [],
})
export class ElectrumClientModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: ElectrumClientModule,
            providers: [ElectrumClientService],
        };
    }
}
