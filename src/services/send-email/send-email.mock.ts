import {SendEmailApi} from "./send-email.api";

export class SendEmailMock implements SendEmailApi {
    async sendNeedsInfoEmail(toEmail: string, caseId: string, needsInfo: string[]): Promise<boolean> {
        console.log('Needs info email not sent: ', {toEmail, caseId})

        return true
    }
}
