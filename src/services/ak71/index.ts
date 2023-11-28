import {Provider} from "@nestjs/common";
import {Ak71Api} from "./ak71.api";
import {Ak71Rest} from "./ak71.rest";

export * from './ak71.api'

let _instance: Ak71Api
export const ak71Api = (): Ak71Api => {
    if (_instance) {
        return _instance
    }

    return _instance = new Ak71Rest()
}

export const ak71Provider: Provider = {
    provide: Ak71Api,
    useFactory: ak71Api
}
