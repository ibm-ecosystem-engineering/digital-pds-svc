import * as Buffer from "buffer";

import {FamilyAllowanceApi} from "./family-allowance.api";
import {DocumentModel, DocumentWithContentModel, FamilyAllowanceModel, FamilyAllowanceStatus} from "../../models";

interface FamilyAllowanceContentModel extends FamilyAllowanceModel<DocumentWithContentModel> {}

const cases: FamilyAllowanceContentModel[] = [{
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    employeeId: '999450',
    governmentId: '123485895',
    changeType: 'add',
    dependent: {
        firstName: 'Sally',
        lastName: 'Doe',
        birthDate: '11/07/2018',
        governmentId: '432840493'
    },
    supportingDocuments: [],
    status: FamilyAllowanceStatus.ReadyForReview,
    history: [],
}, {
    id: '2',
    firstName: 'Jane',
    lastName: 'Doe',
    employeeId: '999451',
    governmentId: '123485896',
    changeType: 'add',
    dependent: {
        firstName: 'Mike',
        lastName: 'Doe',
        birthDate: '11/05/2018',
        governmentId: '432840494'
    },
    supportingDocuments: [],
    status: FamilyAllowanceStatus.ReadyForReview,
    history: [],
}]

export class FamilyAllowanceMock implements FamilyAllowanceApi {

    async addFamilyAllowanceCase(data: FamilyAllowanceModel): Promise<FamilyAllowanceModel> {
        const id = '' + (cases.length + 1)

        const newCase = Object.assign({}, data, {id, status: FamilyAllowanceStatus.ReadyForReview})

        cases.push(newCase as FamilyAllowanceContentModel)

        return newCase;
    }

    async listFamilyAllowanceCases(status?: FamilyAllowanceStatus): Promise<FamilyAllowanceModel[]> {
        if (!status) {
            return cases
        }

        return cases.filter(val => val.status === status)
    }

    async getFamilyAllowanceCase(id: string): Promise<FamilyAllowanceContentModel> {
        const filteredCases: FamilyAllowanceModel[] = cases.filter(val => val.id === id)

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
