import {FamilyAllowanceStatusChangeModel} from "../../../models";

export abstract class StatusChangeHandlerApi {
    abstract handleStatusChange(event: FamilyAllowanceStatusChangeModel): Promise<boolean>;
}
