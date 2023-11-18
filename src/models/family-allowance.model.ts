
export interface DependentModel {
    firstName: string;
    lastName: string;
    birthDate: string;
    governmentId: string;
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

export interface FamilyAllowanceBasicModel {
    id: string;
    firstName: string;
    lastName: string;
    governmentId: string;
    employeeId: string;
    changeType: string;
    dependent: DependentModel;
    status: FamilyAllowanceStatus;
}

export interface FamilyAllowanceModel<D extends DocumentModel = DocumentModel> extends FamilyAllowanceBasicModel {
    supportingDocuments: D[];
    history: ActivityModel[];
}