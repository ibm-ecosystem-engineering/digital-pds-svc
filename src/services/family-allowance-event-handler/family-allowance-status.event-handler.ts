import {getStatusHandler, StatusChangeHandlerApi} from "./event-handlers";
import {familyAllowanceApi} from "../family-allowance";
import {FamilyAllowanceStatusChangeModel} from "../../models";

export class FamilyAllowanceStatusEventHandler {

    constructor() {
        console.log('Subscribing to Family Allowance Case status change events')
        familyAllowanceApi()
            .subscribeToStatusChanges()
            .subscribe({
                next: (data: FamilyAllowanceStatusChangeModel) => this.handleStatusChange(data)
            })
    }

    async handleStatusChange(event: FamilyAllowanceStatusChangeModel) {
        const handler: StatusChangeHandlerApi = getStatusHandler(event.status)

        return handler.handleStatusChange(event)
    }
}

let _instance: FamilyAllowanceStatusEventHandler
export const familyAllowanceStatusEventHandler = (): FamilyAllowanceStatusEventHandler => {
    if (_instance) {
        return _instance
    }

    return _instance = new FamilyAllowanceStatusEventHandler()
}