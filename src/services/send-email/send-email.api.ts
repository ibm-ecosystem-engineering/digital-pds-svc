import {RequiredInformationModel} from "../../models";

export abstract class SendEmailApi {
    abstract sendNeedsInfoEmail(toEmail: string, caseId: string, needsInfo: RequiredInformationModel[]): Promise<boolean>;
}
