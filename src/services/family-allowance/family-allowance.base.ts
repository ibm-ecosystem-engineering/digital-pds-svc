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

export abstract class FamilyAllowanceBase implements FamilyAllowanceApi {
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


        return `Family Allowance Case

ID:\t${data.id}
Type:\t${data.changeType}
Status:\t${data.status}

Applicant:
${printPerson(data.applicant)}

Spouse/partner:
${printPerson(data.spouse, 'Not provided')}
${printOtherParents(data.otherParents)}
Dependents:
${data.dependents.map(printDependent).join('n')}

Supporting documents:
${printDocuments(data.supportingDocuments, 'No documents provided')}
`;
    }

}

const printDependent = (dep: DependentModel): string => {
    return `${dep.lastName}, ${dep.firstName} (${dep.gender})\tBirth date: ${printDate(dep.birthDate)}\tFather: ${printPersonName(dep.father)}\tMother: ${printPersonName(dep.mother)}`
}

const printOtherParents = (parents: PersonModel[] = []): string => {
    if (parents.length === 0) {
        return ''
    }

    return `Other parents:
${parents.map(p => printPerson(p)).join('\n')}
`
}

const printPerson = (person: PersonModel, defaultValue: string = ''): string => {
    if (!person) {
        return defaultValue
    }

    return `${person.lastName}, ${person.firstName} (${person.gender})\t${printPhone(person.phoneNumber)}\t${person.emailAddress}`
}

const printPersonName = (person: PersonModel, defaultValue: string = ''): string => {
    if (!person) {
        return defaultValue
    }

    return `${person.lastName}, ${person.firstName}`
}

const printPhone = (phone: string): string => {
    return phone
}

const printDate = (date: string): string => {
    return date
}

const printDocuments = (docs: DocumentModel[] = [], defaultValue: string = ''): string => {
    if (docs.length === 0) {
        return defaultValue
    }

    return docs.map(printDocument).join('\n')
}

const printDocument = (doc: DocumentModel): string => {
    return `${doc.name} - ${doc.url}`
}
