import {SendEmailApi} from "./send-email.api";
import {RequiredInformationModel} from "../../models";

export class SendEmailMock implements SendEmailApi {
    async sendNeedsInfoEmail(toEmail: string, caseId: string, needsInfo: RequiredInformationModel[]): Promise<boolean> {
        console.log('Needs info email not sent: ', {toEmail, caseId})

        return true
    }
}
