import {FamilyAllowancePrinterApi} from "./family-allowance-printer.api";
import {DependentModel, DocumentModel, FamilyAllowanceModel, PersonModel} from "../../../models";
import {formatDate, formatPhone} from "../../../util";

export class FamilyAllowancePrinterMarkdown implements FamilyAllowancePrinterApi {
    print(data: FamilyAllowanceModel): string {
        return `
**ID:** ${data.id}
    
**Type:** ${data.changeType}
    
**Status:** ${data.status}
    
# Applicant:

${printPerson(data.applicant)}

# Spouse/partner:

${printPerson(data.spouse, 'Not provided')}

${printOtherParents(data.otherParents)}

# Dependents:
${printDependents(data.dependents)}

# Supporting documents:

${printDocuments(data.supportingDocuments, 'No documents provided')}
`
    }

}

const createDependentTable = (): string[] => {
    return [
        '| Name | Gender | Birth date | Father | Mother |',
        '|------|--------|------------|--------|--------|'
    ]
}

const printDependentRow = (dep: DependentModel): string => {
    return `| ${personName(dep)} | ${dep.gender} | ${formatDate(dep.birthDate)} | ${personName(dep.father)} | ${personName(dep.mother)} |`
}

const createPersonTable = (): string[] => {
    return [
        '| Name | Gender | Phone | Email |',
        '|------|--------|-------|-------|'
    ]
}

const printPersonRow = (person: PersonModel): string => {
    return `| ${personName(person)} | ${person.gender} | ${formatPhone(person.phoneNumber)} | ${person.emailAddress} |`
}

const printPerson = (person: PersonModel, defaultValue: string = ''): string => {
    if (!person) {
        return defaultValue
    }

    return createPersonTable().concat(printPersonRow(person)).join('\n')
}

const printOtherParents = (parents: PersonModel[] = []): string => {
    if (parents.length === 0) {
        return ''
    }

    return `# Other parents:
    
${createPersonTable().concat(...parents.map(p => printPersonRow(p))).join('\n')}
`
}

const printDependents = (deps: DependentModel[] = []): string => {
    if (deps.length === 0) {
        return 'No dependents listed'
    }

    return createDependentTable().concat(...deps.map(printDependentRow)).join('\n')
}

const personName = ({firstName, lastName}: {firstName: string, lastName: string}): string => {
    return `${firstName} ${lastName}`
}


const printDocuments = (docs: DocumentModel[] = [], defaultValue: string = ''): string => {
    if (docs.length === 0) {
        return defaultValue
    }

    return docs.map(printDocument).join('\n')
}

const printDocument = (doc: DocumentModel): string => {
    return `- [${doc.name}](${doc.url})`
}
