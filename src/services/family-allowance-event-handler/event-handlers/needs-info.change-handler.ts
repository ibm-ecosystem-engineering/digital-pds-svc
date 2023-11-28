import {StatusChangeHandlerApi} from "./status-change-handler.api";
import {sendEmailApi, SendEmailApi} from "../../send-email";
import {FamilyAllowanceStatusChangeModel} from "../../../models";

class NeedsInfoChangeHandler implements StatusChangeHandlerApi {
    service: SendEmailApi

    constructor() {
        this.service = sendEmailApi()
    }

    async handleStatusChange(event: FamilyAllowanceStatusChangeModel): Promise<boolean> {
        const selectedCase = event.data
        const id = selectedCase.id
        const requiredInfo = selectedCase.requiredInformation.filter(info => !info.completed)

        try {
            await this.service.sendNeedsInfoEmail(selectedCase.applicant.emailAddress, id, requiredInfo)

            return true
        } catch (error) {
            return false
        }
    }
}


let _instance: StatusChangeHandlerApi
export const needsInfoChangeHandler = (): StatusChangeHandlerApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new NeedsInfoChangeHandler()
}
