import {StatusChangeHandlerApi} from "./status-change-handler.api";
import {FamilyAllowanceStatusChangeModel} from "../../../models";

class NoopChangeHandler implements StatusChangeHandlerApi {
    async handleStatusChange(event: FamilyAllowanceStatusChangeModel): Promise<boolean> {
        console.log('Status changed: ', {id: event.data.id, status: event.status, oldStatus: event.oldStatus})

        return false
    }
}

let _instance: StatusChangeHandlerApi
export const noopChangeHandler = (): StatusChangeHandlerApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new NoopChangeHandler()
}

