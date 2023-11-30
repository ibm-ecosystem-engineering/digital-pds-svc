import {StatusChangeHandlerApi} from "./status-change-handler.api";
import {sendEmailApi, SendEmailApi} from "../../send-email";
import {FamilyAllowanceStatusChangeModel} from "../../../models";

class DeniedChangeHandler implements StatusChangeHandlerApi {
    service: SendEmailApi

    constructor() {
        this.service = sendEmailApi()
    }

    async handleStatusChange(event: FamilyAllowanceStatusChangeModel): Promise<boolean> {
        const selectedCase = event.data
        const id = selectedCase.id

        try {
            await this.service.sendDeniedEmail(selectedCase.applicant.emailAddress, id)

            return true
        } catch (error) {
            return false
        }
    }
}


let _instance: StatusChangeHandlerApi
export const deniedChangeHandler = (): StatusChangeHandlerApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new DeniedChangeHandler()
}
