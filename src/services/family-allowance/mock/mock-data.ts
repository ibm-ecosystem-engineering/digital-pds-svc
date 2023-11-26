import {
    DocumentWithContentModel,
    EmployeeModel,
    FamilyAllowanceEmploymentStatus,
    FamilyAllowanceMaritalStatus,
    FamilyAllowanceModel,
    FamilyAllowanceRelationship,
    FamilyAllowanceStatus,
    FamilyAllowanceType,
    SpouseModel
} from "../../../models";

export interface FamilyAllowanceContentModel extends FamilyAllowanceModel<DocumentWithContentModel> {}

const sean: EmployeeModel = {
    firstName: 'Sean',
    lastName: 'Sundberg',
    employeeId: '997498',
    governmentId: '123485895',
    emailAddress: 'seansund@us.ibm.com',
    phoneNumber: '5125551212',
    gender: 'M',
    maritalStatus: FamilyAllowanceMaritalStatus.Married,
    mailingAddress: {
        addressLine1: '1234 Main St',
        city: 'Zurich',
        canton: '',
        country: 'Switzerland',
        postalCode: '13ZH3'
    },
}
const kelly: SpouseModel = {
    firstName: 'Kelly',
    lastName: 'Sundberg',
    governmentId: '123485896',
    emailAddress: 'kelly@thesundbergs.net',
    phoneNumber: '2545551213',
    gender: 'F',
    maritalStatus: FamilyAllowanceMaritalStatus.Married,
    marriedToApplicant: true,
    employmentStatus: FamilyAllowanceEmploymentStatus.SelfEmployed,
    mailingAddress: {
        addressLine1: '1234 Main St',
        city: 'Zurich',
        canton: '',
        country: 'Switzerland',
        postalCode: '13ZH3'
    },
}

const sidneyMitchell: EmployeeModel = {
    firstName: 'Sidney',
    lastName: 'Mitchell',
    employeeId: '999451',
    governmentId: '8764663883',
    emailAddress: 'sidneymitchell@bigbox.com',
    phoneNumber: '2545551214',
    gender: 'F',
    maritalStatus: FamilyAllowanceMaritalStatus.Married,
    mailingAddress: {
        addressLine1: '5345 Main St',
        city: 'Zurich',
        canton: '',
        country: 'Switzerland',
        postalCode: '13ZH4'
    }
}
const irvingMitchell: SpouseModel = {
    firstName: 'Irving',
    lastName: 'Mitchell',
    governmentId: '123485897',
    emailAddress: 'imitchell@mybrand.com',
    phoneNumber: '2545551215',
    employmentStatus: FamilyAllowanceEmploymentStatus.Employed,
    gender: 'M',
    maritalStatus: FamilyAllowanceMaritalStatus.Married,
    marriedToApplicant: true,
    mailingAddress: {
        addressLine1: '5345 Main St',
        city: 'Zurich',
        canton: '',
        country: 'Switzerland',
        postalCode: '13ZH4'
    }
}

export const CASES: FamilyAllowanceContentModel[] = [{
    id: '1',
    applicant: sean,
    spouse: kelly,
    changeType: FamilyAllowanceType.Adoption,
    dependents: [{
        firstName: 'Tucker',
        lastName: 'Sundberg',
        birthDate: '11/07/2023',
        governmentId: '432840493',
        father: sean,
        mother: kelly,
        gender: 'M',
        livesWithApplicant: true,
        relationshipToApplicant: FamilyAllowanceRelationship.Father
    }],
    supportingDocuments: [],
    status: FamilyAllowanceStatus.ReadyForReview,
    history: [],
}, {
    id: '2',
    applicant: sidneyMitchell,
    spouse: irvingMitchell,
    changeType: FamilyAllowanceType.Birth,
    dependents: [{
        firstName: 'Mike',
        lastName: 'Doe',
        birthDate: '11/05/2018',
        governmentId: '432840494',
        gender: 'M',
        father: irvingMitchell,
        mother: sidneyMitchell,
        livesWithApplicant: true,
        relationshipToApplicant: FamilyAllowanceRelationship.Mother,
    }],
    supportingDocuments: [],
    status: FamilyAllowanceStatus.ReadyForReview,
    history: [],
}]
