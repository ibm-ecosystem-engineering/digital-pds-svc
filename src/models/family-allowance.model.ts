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
    description?: string;
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
    ReadyForReview = 'ReadyForReview',
    NeedsInfo = 'NeedsInfo',
    Reviewed = 'Reviewed',
    PendingApproval = 'PendingApproval',
    Approved = 'Approved',
    Denied = 'Denied',
    PendingBookings = 'PendingBookings',
    Closed = 'Closed'
}

export enum FamilyAllowanceStatusFilter {
    All = 'All',
    ReadyForReview = 'ReadyForReview',
    NeedsInfo = 'NeedsInfo',
    Reviewed = 'Reviewed',
    PendingApproval = 'PendingApproval',
    Approved = 'Approved',
    Denied = 'Denied',
    PendingBookings = 'PendingBookings',
    Closed = 'Closed'
}

export const mapFamilyAllowanceStatus = (filter?: FamilyAllowanceStatusFilter): FamilyAllowanceStatus | undefined => {
    if (!filter) {
        return
    }

    switch (filter) {
        case FamilyAllowanceStatusFilter.All:
            return
        default:
            return FamilyAllowanceStatus[filter]
    }
}

export enum FamilyAllowanceType {
    Birth = 'Birth',
    Adoption = 'Adoption',
    ChildAllowance = 'ChildAllowance',
    TrainingAllowance = 'TrainingAllowance'
}


export const serializeFamilyAllowanceType = (val: FamilyAllowanceType): string => {
    const keys: string[] = Object.keys(FamilyAllowanceType).filter(key => FamilyAllowanceType[key] === val)

    if (keys.length === 0) {
        return val
    }

    return keys[0]
}

export enum FamilyAllowanceRelationship {
    Father = 'Father',
    Mother = 'Mother',
    StepFather = 'StepFather',
    StepMother = 'StepMother'
}

export enum FamilyAllowanceEmploymentStatus {
    Employed = 'Employed',
    SelfEmployed = 'SelfEmployed',
    Unemployed = 'Unemployed'
}

export enum FamilyAllowanceMaritalStatus {
    Married = 'Married',
    Divorced = 'Divorced',
    NotMarried = 'NotMarried'
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
    compensationOfficeId?: string;
}

export interface ReviewInputModel {
    requiredInformation?: string[]
    comment?: string
}

export interface FamilyAllowanceStatusChangeModel {
    status: FamilyAllowanceStatus;
    oldStatus?: FamilyAllowanceStatus;
    data: FamilyAllowanceModel;
}
