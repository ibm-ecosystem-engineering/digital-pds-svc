import {FamilyAllowanceApi} from "./family-allowance.api";
import {
    DependentModel,
    DocumentModel,
    DocumentWithContentModel,
    FamilyAllowanceModel,
    FamilyAllowanceStatus,
    PersonModel
} from "../../models";
import * as Buffer from "buffer";
import {FamilyAllowancePrinterMarkdown} from "./printer/family-allowance-printer.markdown";
import {FamilyAllowancePrinterApi} from "./printer/family-allowance-printer.api";

export abstract class FamilyAllowanceBase implements FamilyAllowanceApi {
    printer: FamilyAllowancePrinterApi

    constructor() {
        this.printer = new FamilyAllowancePrinterMarkdown()
    }

    abstract addDocumentToFamilyAllowanceCase(id: string, doc: DocumentModel, content: Buffer): Promise<FamilyAllowanceModel>;

    abstract addFamilyAllowanceCase(newCase: FamilyAllowanceModel): Promise<FamilyAllowanceModel>;

    abstract approveFamilyAllowanceCase(id: string): Promise<FamilyAllowanceModel>;

    abstract closeCase(id: string, resolution: string): Promise<FamilyAllowanceModel>;

    abstract getDocumentForFamilyAllowanceCase(id: string, docId: string): Promise<DocumentWithContentModel>;

    abstract getFamilyAllowanceCase(id: string): Promise<FamilyAllowanceModel>;

    abstract listFamilyAllowanceCases(status?: FamilyAllowanceStatus): Promise<FamilyAllowanceModel[]>;

    abstract reviewFamilyAllowanceCase(id: string, needsInfo?: boolean, comment?: string): Promise<FamilyAllowanceModel>;

    abstract updateFamilyAllowanceCase(id: string, update: Partial<FamilyAllowanceModel>): Promise<FamilyAllowanceModel>;

    async getFamilyAllowanceCaseSummary(id: string): Promise<string> {
        const data = await this.getFamilyAllowanceCase(id);

        return this.printer.print(data)
    }
}
