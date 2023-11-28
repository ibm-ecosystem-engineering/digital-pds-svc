import {Provider} from "@nestjs/common";
import {
    familyAllowanceStatusEventHandler,
    FamilyAllowanceStatusEventHandler
} from "./family-allowance-status.event-handler";

export * from './family-allowance-status.event-handler'

export const familyAllowanceStatusEventHandlerProvider: Provider = {
    provide: FamilyAllowanceStatusEventHandler,
    useValue: familyAllowanceStatusEventHandler()
}
