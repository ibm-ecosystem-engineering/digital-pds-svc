import {DocumentModel, DocumentWithContentModel, FamilyAllowanceModel, FamilyAllowanceStatus} from "../../models";

export abstract class FamilyAllowanceApi {
    abstract addFamilyAllowanceCase(newCase: FamilyAllowanceModel): Promise<FamilyAllowanceModel>

    abstract listFamilyAllowanceCases(status?: FamilyAllowanceStatus): Promise<FamilyAllowanceModel[]>
    abstract getFamilyAllowanceCase(id: string): Promise<FamilyAllowanceModel>

    abstract getFamilyAllowanceCaseSummary(id: string): Promise<string>

    abstract updateFamilyAllowanceCase(id: string, update: Partial<FamilyAllowanceModel>): Promise<FamilyAllowanceModel>
    abstract reviewFamilyAllowanceCase(id: string, needsInfo?: boolean, comment?: string): Promise<FamilyAllowanceModel>

    abstract approveFamilyAllowanceCase(id: string): Promise<FamilyAllowanceModel>
    abstract closeCase(id: string, resolution: string): Promise<FamilyAllowanceModel>

    abstract addDocumentToFamilyAllowanceCase(id: string, doc: DocumentModel, content: Buffer): Promise<FamilyAllowanceModel>
    abstract getDocumentForFamilyAllowanceCase(id: string, docId: string): Promise<DocumentWithContentModel>
}
