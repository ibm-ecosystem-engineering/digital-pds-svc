import {
    DocumentModel,
    DocumentWithContentModel,
    FamilyAllowanceModel,
    FamilyAllowanceStatus,
    FamilyAllowanceStatusChangeModel
} from "../../models";
import {Observable} from "rxjs";
import {FamilyAllowanceMinimal} from "../../controllers/family-allowance.apitypes";

export abstract class FamilyAllowanceApi {
    abstract addFamilyAllowanceCase(newCase: FamilyAllowanceModel): Promise<FamilyAllowanceModel>

    abstract listFamilyAllowanceCases(status?: FamilyAllowanceStatus): Promise<FamilyAllowanceModel[]>
    abstract getFamilyAllowanceCase(id: string): Promise<FamilyAllowanceModel>

    abstract getFamilyAllowanceCaseSummary(id: string): Promise<string>

    abstract updateFamilyAllowanceCase(id: string, update: Partial<FamilyAllowanceModel>): Promise<FamilyAllowanceModel>
    abstract updateFamilyAllowanceStatus(id: string, status: FamilyAllowanceStatus): Promise<FamilyAllowanceModel>

    abstract reviewFamilyAllowanceCase(id: string, needsInfo?: string[], comment?: string): Promise<FamilyAllowanceModel>
    abstract setCompensationOfficeId(id: string, compensationOfficeId: string): Promise<FamilyAllowanceModel>
    abstract sendFamilyAllowanceCaseForBooking(id: string, comment?: string): Promise<FamilyAllowanceModel>
    abstract markFamilyAllowanceCaseBookingsComplete(id: string, comment?: string): Promise<FamilyAllowanceModel>

    abstract updateRequiredInformationStatus(id: string, requiredInfoId: string, completed: boolean): Promise<FamilyAllowanceModel>
    abstract markFamilyAllowanceCaseReadyForReview(id: string): Promise<FamilyAllowanceModel>

    abstract approveFamilyAllowanceCase(id: string): Promise<FamilyAllowanceModel>
    abstract denyFamilyAllowanceCase(id: string, comment?: string): Promise<FamilyAllowanceModel>
    abstract closeCase(id: string, resolution: string): Promise<FamilyAllowanceModel>

    abstract addDocumentToFamilyAllowanceCase(id: string, doc: Omit<DocumentModel, 'id' | 'url'>, content: Buffer): Promise<FamilyAllowanceModel>
    abstract getDocumentForFamilyAllowanceCase(id: string, docId: string): Promise<DocumentWithContentModel>

    abstract subscribeToStatusChanges(): Observable<FamilyAllowanceStatusChangeModel>;
}
