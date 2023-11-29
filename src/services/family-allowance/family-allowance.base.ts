import {Observable} from "rxjs";

import {FamilyAllowanceApi} from "./family-allowance.api";
import {FamilyAllowancePrinterApi} from "./printer/family-allowance-printer.api";
import {FamilyAllowancePrinterSimple} from "./printer/family-allowance-printer.simple";
import {
    DocumentModel,
    DocumentWithContentModel,
    FamilyAllowanceModel,
    FamilyAllowanceStatus,
    FamilyAllowanceStatusChangeModel
} from "../../models";

export abstract class FamilyAllowanceBase implements FamilyAllowanceApi {
    printer: FamilyAllowancePrinterApi

    constructor() {
        this.printer = new FamilyAllowancePrinterSimple()
    }

    async getFamilyAllowanceCaseSummary(id: string): Promise<string> {
        const data = await this.getFamilyAllowanceCase(id);

        return this.printer.print(data)
    }

    abstract addDocumentToFamilyAllowanceCase(id: string, doc: DocumentModel, content: Buffer): Promise<FamilyAllowanceModel>;

    abstract addFamilyAllowanceCase(newCase: FamilyAllowanceModel): Promise<FamilyAllowanceModel>;

    abstract approveFamilyAllowanceCase(id: string): Promise<FamilyAllowanceModel>;

    abstract closeCase(id: string, resolution: string): Promise<FamilyAllowanceModel>;

    abstract getDocumentForFamilyAllowanceCase(id: string, docId: string): Promise<DocumentWithContentModel>;

    abstract getFamilyAllowanceCase(id: string): Promise<FamilyAllowanceModel>;

    abstract listFamilyAllowanceCases(status?: FamilyAllowanceStatus): Promise<FamilyAllowanceModel[]>;

    abstract reviewFamilyAllowanceCase(id: string, needsInfo?: string[], comment?: string): Promise<FamilyAllowanceModel>;

    abstract updateFamilyAllowanceCase(id: string, update: Partial<FamilyAllowanceModel>): Promise<FamilyAllowanceModel>;

    abstract markFamilyAllowanceCaseReadyForReview(id: string): Promise<FamilyAllowanceModel>;

    abstract updateRequiredInformationStatus(id: string, requiredInfoId: string, completed: boolean): Promise<FamilyAllowanceModel>;

    abstract denyFamilyAllowanceCase(id: string, comment?: string): Promise<FamilyAllowanceModel>;

    abstract setCompensationOfficeId(id: string, compensationOfficeId: string): Promise<FamilyAllowanceModel>;

    abstract subscribeToStatusChanges(): Observable<FamilyAllowanceStatusChangeModel>;

    abstract updateFamilyAllowanceStatus(id: string, status: FamilyAllowanceStatus): Promise<FamilyAllowanceModel>;

    abstract sendFamilyAllowanceCaseForBooking(id: string, comment?: string): Promise<FamilyAllowanceModel>;

    abstract markFamilyAllowanceCaseBookingsComplete(id: string, comment?: string): Promise<FamilyAllowanceModel>;
}
