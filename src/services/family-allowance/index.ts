import {Provider} from "@nestjs/common";
import {FamilyAllowanceApi} from "./family-allowance.api";
import {FamilyAllowanceMock} from "./mock";

export * from './family-allowance.api'

let _instance: FamilyAllowanceApi;
export const familyAllowanceApi = () => {
    if (_instance) {
        return _instance
    }

    return _instance = new FamilyAllowanceMock()
}

export const familyAllowanceProvider: Provider = {
    provide: FamilyAllowanceApi,
    useFactory: familyAllowanceApi
}
