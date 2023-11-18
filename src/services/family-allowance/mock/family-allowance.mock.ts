import * as Buffer from "buffer";

import {CASES, FamilyAllowanceContentModel} from "./mock-data";
import {FamilyAllowanceApi} from "../family-allowance.api";
import {DocumentModel, DocumentWithContentModel, FamilyAllowanceModel, FamilyAllowanceStatus} from "../../../models";
import {FamilyAllowanceBase} from "../family-allowance.base";


export class FamilyAllowanceMock extends FamilyAllowanceBase implements FamilyAllowanceApi {

    async addFamilyAllowanceCase(data: FamilyAllowanceModel): Promise<FamilyAllowanceModel> {
        const id = '' + (CASES.length + 1)

        const newCase = Object.assign({}, data, {id, status: FamilyAllowanceStatus.ReadyForReview})

        CASES.push(newCase as FamilyAllowanceContentModel)

        return newCase;
    }

    async listFamilyAllowanceCases(status?: FamilyAllowanceStatus): Promise<FamilyAllowanceModel[]> {
        if (!status) {
            return CASES
        }

        return CASES.filter(val => val.status === status)
    }

    async getFamilyAllowanceCase(id: string): Promise<FamilyAllowanceContentModel> {
        const filteredCases: FamilyAllowanceModel[] = CASES.filter(val => val.id === id)

        if (filteredCases.length === 0) {
            throw new Error(`Case not found: ${id}`)
        }

        return filteredCases[0] as FamilyAllowanceContentModel
    }

    async addDocumentToFamilyAllowanceCase(id: string, doc: DocumentModel, content: Buffer): Promise<FamilyAllowanceModel> {
        const selectedCase = await this.getFamilyAllowanceCase(id)

        const docResult = Object.assign({}, doc, {content})

        selectedCase.supportingDocuments.push(docResult)

        return selectedCase
    }

    async approveFamilyAllowanceCase(id: string): Promise<FamilyAllowanceModel> {
        const selectedCase = await this.getFamilyAllowanceCase(id)

        selectedCase.status = FamilyAllowanceStatus.Approved

        return selectedCase
    }

    async closeCase(id: string, resolution: string): Promise<FamilyAllowanceModel> {
        const selectedCase = await this.getFamilyAllowanceCase(id)

        selectedCase.status = FamilyAllowanceStatus.Closed

        return selectedCase
    }

    async updateFamilyAllowanceCase(id: string, update: Partial<FamilyAllowanceModel>): Promise<FamilyAllowanceModel> {
        const selectedCase = await this.getFamilyAllowanceCase(id)

        Object.assign(selectedCase, update, {id})

        return selectedCase
    }

    async reviewFamilyAllowanceCase(id: string, needsInfo?: boolean): Promise<FamilyAllowanceModel> {
        const selectedCase = await this.getFamilyAllowanceCase(id)

        const status: FamilyAllowanceStatus = needsInfo ? FamilyAllowanceStatus.NeedsInfo : FamilyAllowanceStatus.Reviewed

        Object.assign(selectedCase, {id, status})

        return selectedCase
    }

    async getDocumentForFamilyAllowanceCase(id: string, docId: string): Promise<DocumentWithContentModel> {
        const selectedCase: FamilyAllowanceContentModel = await this.getFamilyAllowanceCase(id)

        const doc = selectedCase.supportingDocuments.filter(val => val.id === docId)

        return doc[0]
    }

}
