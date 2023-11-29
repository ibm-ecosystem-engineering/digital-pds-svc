import {StatusChangeHandlerApi} from "./status-change-handler.api";
import {sendEmailApi, SendEmailApi} from "../../send-email";
import {FamilyAllowanceStatusChangeModel} from "../../../models";

const getBookingEmail = (): string => {
    return process.env['BOOKING_EMAIL']
}

export class PendingBookingsChangeHandler implements StatusChangeHandlerApi {
    service: SendEmailApi

    constructor() {
        this.service = sendEmailApi()
    }

    async handleStatusChange(event: FamilyAllowanceStatusChangeModel): Promise<boolean> {
        const selectedCase = event.data
        const id = selectedCase.id

        const bookingEmail = getBookingEmail()

        if (!bookingEmail) {
            console.log('Booking email address not configured')

            return false
        }

        try {
            await this.service.sendPendingBookingsEmail(bookingEmail, id)

            return true
        } catch (error) {
            return false
        }
    }
}


let _instance: StatusChangeHandlerApi
export const pendingBookingsChangeHandler = (): StatusChangeHandlerApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new PendingBookingsChangeHandler()
}
