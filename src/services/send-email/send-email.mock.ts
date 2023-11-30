import {SendEmailApi} from "./send-email.api";
import {RequiredInformationModel} from "../../models";

export class SendEmailMock implements SendEmailApi {
    async sendNeedsInfoEmail(toEmail: string, caseId: string, needsInfo: RequiredInformationModel[]): Promise<boolean> {
        console.log('Needs info email not sent: ', {toEmail, caseId})

        return false
    }

    async sendPendingBookingsEmail(toEmail: string, caseId: string): Promise<boolean> {
        console.log('Pending bookings email not sent: ', {toEmail, caseId})

        return false
    }

    async sendApprovedEmail(toEmail: string, caseId: string): Promise<boolean> {
        console.log('Approved email not sent: ', {toEmail, caseId})

        return false
    }

    async sendDeniedEmail(toEmail: string, caseId: string): Promise<boolean> {
        console.log('Denied email not sent: ', {toEmail, caseId})

        return false
    }
}
