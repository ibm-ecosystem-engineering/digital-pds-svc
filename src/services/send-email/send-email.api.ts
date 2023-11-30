import {RequiredInformationModel} from "../../models";

export abstract class SendEmailApi {
    abstract sendNeedsInfoEmail(toEmail: string, caseId: string, needsInfo: RequiredInformationModel[]): Promise<boolean>;
    abstract sendPendingBookingsEmail(toEmail: string, caseId: string): Promise<boolean>;
    abstract sendDeniedEmail(toEmail: string, caseId: string): Promise<boolean>;
    abstract sendApprovedEmail(toEmail: string, caseId: string): Promise<boolean>;
}
