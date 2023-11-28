import {ApiHideProperty, ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {
    ActivityModel,
    AddressModel,
    DependentModel,
    DocumentModel,
    DocumentWithContentModel,
    EmployeeModel,
    FamilyAllowanceBasicModel,
    FamilyAllowanceMaritalStatus,
    FamilyAllowanceModel,
    FamilyAllowanceRelationship,
    FamilyAllowanceStatus,
    FamilyAllowanceType,
    OtherParentModel,
    PersonModel,
    RequiredInformationModel,
    SpouseModel
} from "../models";

export class Dependent implements DependentModel {
    @ApiProperty({title: 'ID'})
    id: string;
    @ApiProperty({title: 'Birth Date', format: 'date'})
    birthDate: string;
    @ApiProperty({title: 'First Name'})
    firstName: string;
    @ApiHideProperty()
    governmentId: string;
    @ApiProperty({title: 'Last Name'})
    lastName: string;
    @ApiProperty({title: 'Father', type: () => Person})
    father: PersonModel;
    @ApiProperty({title: 'Gender'})
    gender: string;
    @ApiProperty({title: 'Lives with Applicant'})
    livesWithApplicant: boolean;
    @ApiProperty({title: 'Mother', type: () => Person})
    mother: PersonModel;
    @ApiProperty({title: 'Relationship to applicant', enum: FamilyAllowanceRelationship})
    relationshipToApplicant: FamilyAllowanceRelationship;
}

export class Person implements PersonModel {
    @ApiProperty({title: 'ID'})
    id: string;
    @ApiProperty({title: 'Email Address', format: 'email'})
    emailAddress: string;
    @ApiProperty({title: 'First Name'})
    firstName: string;
    @ApiProperty({title: 'Gender'})
    gender: string;
    @ApiHideProperty()
    governmentId: string;
    @ApiProperty({title: 'Last Name'})
    lastName: string;
    @ApiProperty({title: 'Mailing Address', type: () => Address})
    mailingAddress: AddressModel;
    @ApiProperty({title: 'Marital Status', enum: FamilyAllowanceMaritalStatus})
    maritalStatus: FamilyAllowanceMaritalStatus;
    @ApiProperty({title: 'Phone Number', format: 'phone'})
    phoneNumber: string;

}

export class Activity implements ActivityModel {
    @ApiProperty({title: 'ID'})
    id: string;
    @ApiProperty()
    actor: string;
    @ApiProperty()
    comment: string;
    @ApiProperty()
    timestamp: string;
    @ApiProperty()
    type: string;
}

export class FamilyAllowanceDocument implements Omit<DocumentModel, 'id' | 'url'> {
    @ApiProperty()
    name: string;
    @ApiProperty()
    type: string;
    @ApiPropertyOptional()
    description?: string;
}

export interface ListResult<T> {
    instances: T[]
}

export class FamilyAllowanceListResult implements ListResult<FamilyAllowanceMinimal> {
    @ApiProperty({title: 'Results', type: () => [FamilyAllowanceMinimal]})
    instances: FamilyAllowanceMinimal[]
}

export class FamilyAllowanceDocListResult implements ListResult<FamilyAllowanceDocument> {
    @ApiProperty({title: 'Results', type: () => [FamilyAllowanceDocument]})
    instances: FamilyAllowanceDocument[];
}

export class FamilyAllowanceHistoryListResult implements ListResult<Activity> {
    @ApiProperty({title: 'Results', type: () => [Activity]})
    instances: Activity[];
}

export class FamilyAllowanceMinimal {
    @ApiProperty({title: 'Change type'})
    changeType: string;
    @ApiProperty({title: 'Dependent name(s)'})
    dependentNames: string;
    @ApiProperty({title: 'Employee id'})
    employeeId: string;
    @ApiProperty({title: 'First name'})
    firstName: string;
    @ApiProperty({title: 'Id'})
    id: string;
    @ApiProperty({title: 'Last name'})
    lastName: string;
    @ApiProperty({title: 'Status'})
    status: string;
}

export class FamilyAllowanceBasic implements FamilyAllowanceBasicModel {
    @ApiProperty({title: 'ID'})
    id: string;
    @ApiProperty({title: 'Applicant', type: () => Employee})
    applicant: EmployeeModel;
    @ApiPropertyOptional({title: 'Spouse'})
    spouse?: SpouseModel;
    @ApiHideProperty()
    otherParents?: OtherParentModel[];
    @ApiProperty({title: 'Change Type'})
    changeType: FamilyAllowanceType;
    @ApiProperty({type: () => [Dependent]})
    dependents: DependentModel[];
    @ApiProperty({title: 'Status', enum: FamilyAllowanceStatus})
    status: FamilyAllowanceStatus;
    @ApiProperty({title: 'Last Name'})
    lastName: string;
}

export class Employee implements EmployeeModel {
    @ApiProperty({title: 'ID'})
    id: string;
    @ApiProperty({title: 'Employee ID'})
    employeeId: string;
    @ApiHideProperty()
    governmentId: string;
    @ApiProperty({title: 'First Name'})
    firstName: string;
    @ApiProperty({title: 'Last Name'})
    lastName: string;
    @ApiProperty({title: 'Email Address'})
    emailAddress: string;
    @ApiProperty({title: 'Gender'})
    gender: string;
    @ApiProperty({title: 'Address', type: () => Address})
    mailingAddress: AddressModel;
    @ApiProperty({title: 'Marital Status', enum: FamilyAllowanceMaritalStatus})
    maritalStatus: FamilyAllowanceMaritalStatus;
    @ApiProperty({title: 'Phone Number'})
    phoneNumber: string;
    @ApiProperty({title: 'Relationship to Dependent', enum: FamilyAllowanceRelationship})
    relationshipToDependent: FamilyAllowanceRelationship;
}

export class Address implements AddressModel {
    @ApiProperty({title: 'Address Line 1'})
    addressLine1: string;
    @ApiProperty({title: 'Address Line 2'})
    addressLine2: string;
    @ApiProperty({title: 'Canton'})
    canton: string;
    @ApiProperty({title: 'City'})
    city: string;
    @ApiProperty({title: 'Country'})
    country: string;
    @ApiProperty({title: 'Postal Code'})
    postalCode: string;
}

export class RequiredInformation implements RequiredInformationModel {
    @ApiProperty()
    id: string;
    @ApiProperty()
    description: string;
    @ApiProperty({type: () => Boolean})
    completed: boolean;
}

export class FamilyAllowance extends FamilyAllowanceBasic implements FamilyAllowanceModel {
    @ApiProperty({type: () => [Activity]})
    history: ActivityModel[];
    @ApiProperty({type: () => [FamilyAllowanceDocument]})
    supportingDocuments: DocumentModel[];
    @ApiProperty({type: () => [RequiredInformation]})
    requiredInformation: RequiredInformationModel[];
    @ApiPropertyOptional()
    compensationOfficeId?: string;
}

export const minimizeFamilyAllowanceModel = (input: FamilyAllowanceModel): FamilyAllowanceMinimal => {
    return {
        id: input.id,
        changeType: input.changeType,
        employeeId: input.applicant.employeeId,
        firstName: input.applicant.firstName,
        lastName: input.applicant.lastName,
        status: input.status,
        dependentNames: input.dependents.map(dep => `${dep.firstName} ${dep.lastName}`).join(', ')
    }
}

export const familyAllowanceToFamilyAllowanceBasic = (input: FamilyAllowanceModel): FamilyAllowanceBasicModel => {
    return {
        id: input.id,
        applicant: input.applicant,
        spouse: input.spouse,
        otherParents: input.otherParents,
        changeType: input.changeType,
        dependents: input.dependents,
        status: input.status,
    }
}

export const familyAllowanceToDocs = (input: FamilyAllowanceModel): DocumentModel[] => {
    return (input.supportingDocuments || [])
        .map(doc => ({name: doc.name, type: doc.type, id: doc.id, url: doc.url}))
}

export const familyAllowanceToHistory = (input: FamilyAllowanceModel): ActivityModel[] => {
    return input.history || []
}

export const filterSupportingDocuments = (docs: DocumentModel[]): DocumentModel[] => {
    return docs.map(doc => {
        const val = Object.assign({}, doc) as DocumentWithContentModel

        delete val.content

        return val
    })
}

export const filterResult = (result: FamilyAllowanceModel): FamilyAllowanceModel => {
    return Object.assign({}, result, {supportingDocuments: filterSupportingDocuments(result.supportingDocuments)})
}

export class FamilyAllowanceSummary {
    @ApiProperty({title: 'Family Allowance Case'})
    summary: string;
}

export class NeedsInfoInput {
    @ApiProperty({type: () => [String]})
    requiredInformation: string[];
    @ApiProperty()
    comment?: string;
}
