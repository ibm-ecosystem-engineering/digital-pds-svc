
export abstract class SendEmailApi {
    abstract sendNeedsInfoEmail(toEmail: string, caseId: string, needsInfo: string[]): Promise<boolean>;
}
