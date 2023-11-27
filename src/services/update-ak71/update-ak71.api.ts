import {FamilyAllowanceModel} from "../../models";

export enum Ak71FamilyAllowanceStatus {
    Pending = 'Pending',
    NeedsInfo = 'NeedsInfo',
    Approved = 'Approved',
    Denied = 'Denied'
}

export enum Ak71FamilyAllowanceType {
    Birth = 'Birth',
    Adoption = 'Adoption',
    ChildAllowance = 'Child Allowance',
    TrainingAllowance = 'Training Allowance'
}

export interface Ak71FamilyAllowanceModel {
    id: string;
    firstName: string;
    lastName: string;
    status: Ak71FamilyAllowanceStatus;
    type: Ak71FamilyAllowanceType;
}

export abstract class UpdateAk71Api {
    abstract sendToAk71(familyAllowanceCase: FamilyAllowanceModel): Promise<Ak71FamilyAllowanceModel>;
}
