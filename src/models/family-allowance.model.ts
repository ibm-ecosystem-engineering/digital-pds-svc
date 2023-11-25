
export interface DependentModel {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    governmentId: string;
    livesWithApplicant: boolean;
    relationshipToApplicant: FamilyAllowanceRelationship;
    father: PersonModel;
    mother: PersonModel;
}

export interface DocumentModel {
    id: string;
    name: string;
    type: string;
    url: string;
}

export interface DocumentWithContentModel extends DocumentModel {
    content: Buffer
}

export interface ActivityModel {
    timestamp: string;
    actor: string;
    type: string;
    comment: string;
}

export enum FamilyAllowanceStatus {
    ReadyForReview = 'Ready for Review',
    NeedsInfo = 'Needs Info',
    Reviewed = 'Reviewed',
    Approved = 'Approved',
    Closed = 'Closed'
}

export enum FamilyAllowanceType {
    Birth = 'Birth',
    Adoption = 'Adoption',
    ChildAllowance = 'Child Allowance',
    TrainingAllowance = 'Training Allowance'
}

export enum FamilyAllowanceRelationship {
    Father = 'Father',
    Mother = 'Mother',
    StepFather = 'StepFather',
    StepMother = 'StepMother'
}

export enum FamilyAllowanceEmploymentStatus {
    Employed = 'Employed',
    SelfEmployed = 'Self Employed',
    Unemployed = 'Unemployed'
}

export enum FamilyAllowanceMaritalStatus {
    Married = 'Married',
    Divorced = 'Divorced',
    NotMarried = 'Not Married'
}

export interface AddressModel {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    canton: string;
    country: string;
    postalCode: string;
}

export interface PersonModel {
    firstName: string;
    lastName: string;
    governmentId: string;
    emailAddress: string;
    phoneNumber: string;
    mailingAddress: AddressModel;
    maritalStatus: FamilyAllowanceMaritalStatus;
    gender: string;
}

export interface EmployeeModel extends PersonModel {
    employeeId: string;
}

export interface OtherParentModel extends PersonModel {
    employmentStatus: FamilyAllowanceEmploymentStatus;
}

export interface SpouseModel extends OtherParentModel {
    marriedToApplicant: boolean;
}

export interface FamilyAllowanceBasicModel {
    id: string;
    changeType: FamilyAllowanceType;
    status: FamilyAllowanceStatus;
    applicant: EmployeeModel;
    spouse?: SpouseModel;
    otherParents?: OtherParentModel[];
    dependents: DependentModel[];
}

export interface FamilyAllowanceModel<D extends DocumentModel = DocumentModel> extends FamilyAllowanceBasicModel {
    supportingDocuments: D[];
    history: ActivityModel[];
}

