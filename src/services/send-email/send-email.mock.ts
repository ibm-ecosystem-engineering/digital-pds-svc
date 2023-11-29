import {SendEmailApi} from "./send-email.api";
import {RequiredInformationModel} from "../../models";
import * as console from "console";

export class SendEmailMock implements SendEmailApi {
    async sendNeedsInfoEmail(toEmail: string, caseId: string, needsInfo: RequiredInformationModel[]): Promise<boolean> {
        console.log('Needs info email not sent: ', {toEmail, caseId})

        return true
    }

    async sendPendingBookingsEmail(toEmail: string, caseId: string): Promise<boolean> {
        console.log('Pending bookings email not sent: ', {toEmail, caseId})

        return true
    }
}
