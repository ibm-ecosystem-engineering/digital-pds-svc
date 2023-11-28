import * as Buffer from "buffer";

import {CASES, FamilyAllowanceContentModel, nextActivityId, nextDocumentId, nextInfoId} from "./mock-data";
import {FamilyAllowanceApi} from "../family-allowance.api";
import {FamilyAllowanceBase} from "../family-allowance.base";
import {
    ActivityModel,
    DocumentModel,
    DocumentWithContentModel,
    FamilyAllowanceModel,
    FamilyAllowanceStatus,
    RequiredInformationModel
} from "../../../models";
import {buildDocumentUrl} from "../../../util";
import {sendEmailApi, SendEmailApi} from "../../send-email";
import {updateAk71Api, UpdateAk71Api} from "../../update-ak71";

export class FamilyAllowanceMock extends FamilyAllowanceBase implements FamilyAllowanceApi {
    emailService: SendEmailApi
    ak71Service: UpdateAk71Api

    constructor() {
        super();

        this.emailService = sendEmailApi()
        this.ak71Service = updateAk71Api()
    }

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

        selectedCase.status = FamilyAllowanceStatus.Approved

        return selectedCase
    }

    async denyFamilyAllowanceCase(id: string, comment?: string): Promise<FamilyAllowanceModel<DocumentModel>> {
        const selectedCase: FamilyAllowanceContentModel = await this.getFamilyAllowanceCase(id)

        const status = FamilyAllowanceStatus.Denied

        const activity: ActivityModel = {
            id: nextActivityId(),
            timestamp: new Date().toISOString(),
            actor: 'ak71',
            type: status,
            comment
        }

        Object.assign(selectedCase, {status, history: (selectedCase.history || []).concat(activity)})

        return selectedCase;
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

    async reviewFamilyAllowanceCase(id: string, needsInfo?: string[]): Promise<FamilyAllowanceModel> {
        const selectedCase = await this.getFamilyAllowanceCase(id)

        const status: FamilyAllowanceStatus = needsInfo && needsInfo.length > 0 ? FamilyAllowanceStatus.NeedsInfo : FamilyAllowanceStatus.Reviewed

        const requiredInfo: RequiredInformationModel[] = (needsInfo || []).map(description => ({id: nextInfoId(), description, completed: false}))

        Object.assign(selectedCase, {id, status, requiredInformation: selectedCase.requiredInformation.concat(...requiredInfo)})

        if (status === FamilyAllowanceStatus.NeedsInfo) {
            await this.emailService.sendNeedsInfoEmail(selectedCase.applicant.emailAddress, id, needsInfo)
        } else {
            try {
                const {id: compensationOfficeId} = await this.ak71Service.sendToAk71(selectedCase)

                Object.assign(selectedCase, {compensationOfficeId})
            } catch (error) {
                console.error('Error sending to compensation office: ', {error})

                Object.assign(selectedCase, {status: FamilyAllowanceStatus.ReadyForReview})
            }
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

        return Object.assign(selectedCase, {status: FamilyAllowanceStatus.ReadyForReview});
    }

    async updateRequiredInformationStatus(id: string, requiredInfoId: string, completed: boolean): Promise<FamilyAllowanceModel> {
        const selectedCase: FamilyAllowanceContentModel = await this.getFamilyAllowanceCase(id)

        selectedCase.requiredInformation
            .filter(info => info.id === requiredInfoId)
            .forEach(info => info.completed = completed)

        return selectedCase;
    }

}
