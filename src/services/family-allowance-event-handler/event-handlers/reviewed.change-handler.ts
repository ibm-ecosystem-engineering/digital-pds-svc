import {StatusChangeHandlerApi} from "./status-change-handler.api";
import {FamilyAllowanceStatus, FamilyAllowanceStatusChangeModel} from "../../../models";
import {Ak71Api, ak71Api} from "../../ak71";
import {sendEmailApi} from "../../send-email";
import {familyAllowanceApi, FamilyAllowanceApi} from "../../family-allowance";

class ReviewedChangeHandler implements StatusChangeHandlerApi {
    service: FamilyAllowanceApi
    ak71Service: Ak71Api

    constructor() {
        this.service = familyAllowanceApi()
        this.ak71Service = ak71Api()
    }

    async handleStatusChange(event: FamilyAllowanceStatusChangeModel): Promise<boolean> {
        const selectedCase = event.data
        const id = selectedCase.id

        try {
            const {id: compensationOfficeId} = await this.ak71Service.sendToAk71(selectedCase)

            await this.service.setCompensationOfficeId(id, compensationOfficeId)

            return true
        } catch (error) {
            console.error('Error sending to compensation office: ', {error})

            return false
        }
    }

}

let _instance: StatusChangeHandlerApi
export const reviewedChangeHandler = (): StatusChangeHandlerApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new ReviewedChangeHandler()
}

