import {FamilyAllowancePrinterApi} from "./family-allowance-printer.api";
import {DependentModel, DocumentModel, FamilyAllowanceModel, PersonModel} from "../../../models";
import {formatDate, formatPhone} from "../../../util";

export class FamilyAllowancePrinterSimple implements FamilyAllowancePrinterApi {
    print(data: FamilyAllowanceModel): string {
        return `
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

const printDocuments = (docs: DocumentModel[] = [], defaultValue: string = ''): string => {
    if (docs.length === 0) {
        return defaultValue
    }

    return docs.map(printDocument).join('\n')
}

const printDocument = (doc: DocumentModel): string => {
    return `${doc.name} - ${doc.url}`
}


const printPerson = (person: PersonModel, defaultValue: string = ''): string => {
    if (!person) {
        return defaultValue
    }

    return `${person.lastName}, ${person.firstName} (${person.gender})\t${formatPhone(person.phoneNumber)}\t${person.emailAddress}`
}

const printPersonName = (person: PersonModel, defaultValue: string = ''): string => {
    if (!person) {
        return defaultValue
    }

    return `${person.lastName}, ${person.firstName}`
}

const printDependent = (dep: DependentModel): string => {
    return `${dep.lastName}, ${dep.firstName} (${dep.gender})\tBirth date: ${formatDate(dep.birthDate)}\tFather: ${printPersonName(dep.father)}\tMother: ${printPersonName(dep.mother)}`
}

const printOtherParents = (parents: PersonModel[] = []): string => {
    if (parents.length === 0) {
        return ''
    }

    return `Other parents:
${parents.map(p => printPerson(p)).join('\n')}
`
}
