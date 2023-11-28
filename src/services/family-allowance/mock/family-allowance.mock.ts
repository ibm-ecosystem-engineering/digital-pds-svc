import * as Buffer from "buffer";
import {Observable, Subject} from "rxjs";

import {CASES, FamilyAllowanceContentModel, nextActivityId, nextDocumentId, nextInfoId} from "./mock-data";
import {FamilyAllowanceApi} from "../family-allowance.api";
import {FamilyAllowanceBase} from "../family-allowance.base";
import {
    ActivityModel,
    DocumentModel,
    DocumentWithContentModel,
    FamilyAllowanceModel,
    FamilyAllowanceStatus,
    FamilyAllowanceStatusChangeModel,
    RequiredInformationModel
} from "../../../models";
import {buildDocumentUrl} from "../../../util";

export class FamilyAllowanceMock extends FamilyAllowanceBase implements FamilyAllowanceApi {
    subject: Subject<FamilyAllowanceStatusChangeModel>

    constructor() {
        super();

        this.subject = new Subject()
    }

    async addFamilyAllowanceCase(data: FamilyAllowanceModel): Promise<FamilyAllowanceModel> {
        const id = '' + (CASES.length + 1)

        const status = FamilyAllowanceStatus.ReadyForReview
        const newCase = Object.assign({}, data, {id, status})

        CASES.push(newCase as FamilyAllowanceContentModel)

        this.subject.next({status, data: newCase})

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

    async addDocumentToFamilyAllowanceCase(id: string, doc: Omit<DocumentModel, 'id' | 'url'>, content: Buffer): Promise<FamilyAllowanceModel> {
        const selectedCase = await this.getFamilyAllowanceCase(id)

        const documentId = nextDocumentId()

        const url: string = buildDocumentUrl(id, {id: documentId, name: doc.name})

        const docResult: DocumentWithContentModel = Object.assign({}, doc, {id: documentId, url, content})

        selectedCase.supportingDocuments.push(docResult)

        return selectedCase
    }

    async approveFamilyAllowanceCase(id: string): Promise<FamilyAllowanceModel> {
        const selectedCase = await this.getFamilyAllowanceCase(id)

        const oldStatus = selectedCase.status
        const status = FamilyAllowanceStatus.Approved

        Object.assign(selectedCase, {status})

        if (statusChanged(oldStatus, status)) {
            this.subject.next({status, oldStatus, data: selectedCase})
        }

        return selectedCase
    }

    async denyFamilyAllowanceCase(id: string, comment?: string): Promise<FamilyAllowanceModel<DocumentModel>> {
        const selectedCase: FamilyAllowanceContentModel = await this.getFamilyAllowanceCase(id)

        const oldStatus = selectedCase.status
        const status = FamilyAllowanceStatus.Denied

        const activity: ActivityModel = {
            id: nextActivityId(),
            timestamp: new Date().toISOString(),
            actor: 'ak71',
            type: status,
            comment
        }

        Object.assign(selectedCase, {status, history: (selectedCase.history || []).concat(activity)})

        if (statusChanged(oldStatus, status)) {
            this.subject.next({status, oldStatus, data: selectedCase})
        }

        return selectedCase;
    }

    async closeCase(id: string, resolution: string): Promise<FamilyAllowanceModel> {
        const selectedCase = await this.getFamilyAllowanceCase(id)

        const oldStatus = selectedCase.status
        const status = FamilyAllowanceStatus.Closed

        selectedCase.status = status

        if (statusChanged(oldStatus, status)) {
            this.subject.next({status, oldStatus, data: selectedCase})
        }

        return selectedCase
    }

    async updateFamilyAllowanceCase(id: string, update: Partial<FamilyAllowanceModel>): Promise<FamilyAllowanceModel> {
        const selectedCase = await this.getFamilyAllowanceCase(id)

        const oldStatus = selectedCase.status
        const status = update.status || oldStatus

        Object.assign(selectedCase, update, {id})

        if (statusChanged(oldStatus, status)) {
            this.subject.next({status, oldStatus, data: selectedCase})
        }

        return selectedCase
    }

    async reviewFamilyAllowanceCase(id: string, needsInfo?: string[]): Promise<FamilyAllowanceModel> {
        const selectedCase = await this.getFamilyAllowanceCase(id)

        const oldStatus = selectedCase.status
        const status: FamilyAllowanceStatus = needsInfo && needsInfo.length > 0 ? FamilyAllowanceStatus.NeedsInfo : FamilyAllowanceStatus.Reviewed

        const requiredInfo: RequiredInformationModel[] = (needsInfo || []).map(description => ({id: nextInfoId(), description, completed: false}))

        Object.assign(selectedCase, {id, status, requiredInformation: selectedCase.requiredInformation.concat(...requiredInfo)})

        if (statusChanged(oldStatus, selectedCase.status)) {
            this.subject.next({status, oldStatus, data: selectedCase})
        }

        return selectedCase
    }

    async getDocumentForFamilyAllowanceCase(id: string, docId: string): Promise<DocumentWithContentModel> {
        const selectedCase: FamilyAllowanceContentModel = await this.getFamilyAllowanceCase(id)

        const doc = selectedCase.supportingDocuments.filter(val => val.id === docId)

        return doc[0]
    }

    async markFamilyAllowanceCaseReadyForReview(id: string): Promise<FamilyAllowanceModel> {
        const selectedCase: FamilyAllowanceContentModel = await this.getFamilyAllowanceCase(id)

        const oldStatus = selectedCase.status
        const status = FamilyAllowanceStatus.ReadyForReview;

        Object.assign(selectedCase, {status});

        if (statusChanged(oldStatus, status)) {
            this.subject.next({oldStatus, status, data: selectedCase})
        }

        return selectedCase
    }

    async updateRequiredInformationStatus(id: string, requiredInfoId: string, completed: boolean): Promise<FamilyAllowanceModel> {
        const selectedCase: FamilyAllowanceContentModel = await this.getFamilyAllowanceCase(id)

        selectedCase.requiredInformation
            .filter(info => info.id === requiredInfoId)
            .forEach(info => info.completed = completed)

        return selectedCase;
    }

    async updateFamilyAllowanceStatus(id: string, status: FamilyAllowanceStatus): Promise<FamilyAllowanceModel> {
        const selectedCase: FamilyAllowanceContentModel = await this.getFamilyAllowanceCase(id)

        const oldStatus = selectedCase.status

        Object.assign(selectedCase, {status})

        if (statusChanged(oldStatus, status)) {
            this.subject.next({oldStatus, status, data: selectedCase})
        }

        return selectedCase
    }

    async setCompensationOfficeId(id: string, compensationOfficeId: string): Promise<FamilyAllowanceModel> {
        const selectedCase: FamilyAllowanceContentModel = await this.getFamilyAllowanceCase(id)

        const oldStatus = selectedCase.status
        const status = FamilyAllowanceStatus.PendingApproval

        Object.assign(selectedCase, {compensationOfficeId, status})

        if (statusChanged(oldStatus, status)) {
            this.subject.next({oldStatus, status, data: selectedCase})
        }

        return selectedCase
    }


    subscribeToStatusChanges(): Observable<FamilyAllowanceStatusChangeModel> {
        return this.subject;
    }

}

const statusChanged = (oldStatus: FamilyAllowanceStatus, status: FamilyAllowanceStatus) => {
    return oldStatus !== status
}