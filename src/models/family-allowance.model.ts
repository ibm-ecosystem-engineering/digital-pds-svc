
export interface DependentModel {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    governmentId: string;
    livesWithApplicant: boolean;
    relationshipToApplicant: FamilyAllowanceRelationship;
    father?: PersonModel;
    mother?: PersonModel;
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
    id: string;
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

export enum FamilyAllowanceStatusFilter {
    All = 'All',
    ReadyForReview = 'Ready for Review',
    NeedsInfo = 'Needs Info',
    Reviewed = 'Reviewed',
    Approved = 'Approved',
    Closed = 'Closed'
}

export const mapFamilyAllowanceStatus = (filter?: FamilyAllowanceStatusFilter): FamilyAllowanceStatus | undefined => {
    if (!filter) {
        return
    }

    switch (filter) {
        case FamilyAllowanceStatusFilter.Approved:
            return FamilyAllowanceStatus.Approved
        case FamilyAllowanceStatusFilter.Closed:
            return FamilyAllowanceStatus.Closed
        case FamilyAllowanceStatusFilter.Reviewed:
            return FamilyAllowanceStatus.Reviewed
        case FamilyAllowanceStatusFilter.NeedsInfo:
            return FamilyAllowanceStatus.NeedsInfo
        case FamilyAllowanceStatusFilter.ReadyForReview:
            return FamilyAllowanceStatus.ReadyForReview
        case FamilyAllowanceStatusFilter.All:
        default:
            return
    }
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
    id: string;
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

export interface RequiredInformationModel {
    id: string;
    description: string;
    completed: boolean;
}

export interface FamilyAllowanceModel<D extends DocumentModel = DocumentModel> extends FamilyAllowanceBasicModel {
    supportingDocuments: D[];
    requiredInformation: RequiredInformationModel[];
    history: ActivityModel[];
}

