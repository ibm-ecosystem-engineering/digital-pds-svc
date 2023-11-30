import {StatusChangeHandlerApi} from "./status-change-handler.api";

import {FamilyAllowanceStatusEventHandler} from "../family-allowance-status.event-handler";
import {FamilyAllowanceStatusChangeModel} from "../../../models";
import {sendEmailApi, SendEmailApi} from "../../send-email";

export class ApprovedChangeHandler implements FamilyAllowanceStatusEventHandler {
    service: SendEmailApi

    constructor() {
        this.service = sendEmailApi()
    }

    async handleStatusChange(event: FamilyAllowanceStatusChangeModel): Promise<boolean> {
        const selectedCase = event.data
        const id = selectedCase.id

        try {
            await this.service.sendApprovedEmail(selectedCase.applicant.emailAddress, id)

            return true
        } catch (error) {
            return false
        }
    }
}


let _instance: StatusChangeHandlerApi
export const approvedChangeHandler = (): StatusChangeHandlerApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new ApprovedChangeHandler()
}
