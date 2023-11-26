import {Field, ID, InputType, ObjectType, registerEnumType} from "@nestjs/graphql";
import {
    ActivityModel, AddressModel,
    DependentModel,
    DocumentModel,
    EmployeeModel, FamilyAllowanceEmploymentStatus, FamilyAllowanceMaritalStatus,
    FamilyAllowanceModel, FamilyAllowanceRelationship, FamilyAllowanceStatus, FamilyAllowanceStatusFilter,
    FamilyAllowanceType, OtherParentModel, PersonModel, RequiredInformationModel, SpouseModel
} from "../models";

@ObjectType({description: "Document that supports the Family Allowance Case"})
export class FamilyAllowanceDocument implements DocumentModel {
    @Field(() => ID)
    id: string;
    @Field()
    name: string;
    @Field()
    type: string;
    @Field()
    url: string;
}

registerEnumType(FamilyAllowanceType, {name: 'FamilyAllowanceType'})
registerEnumType(FamilyAllowanceStatus, {name: 'FamilyAllowanceStatus'})
registerEnumType(FamilyAllowanceStatusFilter, {name: 'FamilyAllowanceStatusFilter'})
registerEnumType(FamilyAllowanceMaritalStatus, {name: 'FamilyAllowanceMaritalStatus'})
registerEnumType(FamilyAllowanceEmploymentStatus, {name: 'FamilyAllowanceEmploymentStatus'})
registerEnumType(FamilyAllowanceRelationship, {name: 'FamilyAllowanceRelationship'})

@ObjectType()
export class Address implements AddressModel {
    @Field()
    addressLine1: string;
    @Field({nullable: true})
    addressLine2?: string;
    @Field()
    canton: string;
    @Field()
    city: string;
    @Field()
    country: string;
    @Field()
    postalCode: string;
}

@ObjectType()
export class Person implements PersonModel {
    @Field(() => ID)
    id: string;
    @Field()
    firstName: string;
    @Field()
    lastName: string;
    @Field()
    governmentId: string;
    @Field()
    emailAddress: string;
    @Field()
    phoneNumber: string;
    @Field(() => Address)
    mailingAddress: AddressModel;
    @Field(() => FamilyAllowanceMaritalStatus)
    maritalStatus: FamilyAllowanceMaritalStatus;
    @Field()
    gender: string;
}

@ObjectType()
export class Employee extends Person implements EmployeeModel {
    @Field()
    employeeId: string;
}

@ObjectType()
export class OtherParent extends Person implements OtherParentModel {
    @Field(() => FamilyAllowanceEmploymentStatus)
    employmentStatus: FamilyAllowanceEmploymentStatus;
}

@ObjectType()
export class Spouse extends OtherParent implements SpouseModel {
    @Field(() => Boolean)
    marriedToApplicant: boolean;
}

@ObjectType()
export class Dependent implements DependentModel {
    @Field(() => ID)
    id: string;
    @Field()
    firstName: string;
    @Field()
    lastName: string;
    @Field()
    birthDate: string;
    @Field()
    gender: string;
    @Field()
    governmentId: string;
    @Field(() => Boolean)
    livesWithApplicant: boolean;
    @Field(() => FamilyAllowanceRelationship)
    relationshipToApplicant: FamilyAllowanceRelationship;
    @Field(() => Person, {nullable: true})
    father?: PersonModel;
    @Field(() => Person, {nullable: true})
    mother?: PersonModel;
}

@ObjectType()
export class Activity implements ActivityModel {
    @Field(() => ID)
    id: string;
    @Field()
    actor: string;
    @Field()
    comment: string;
    @Field()
    timestamp: string;
    @Field()
    type: string;
}

@ObjectType()
export class RequiredInformation implements RequiredInformationModel {
    @Field(() => ID)
    id: string;
    @Field()
    description: string;
    @Field(() => Boolean)
    completed: boolean;
}

@ObjectType()
export class FamilyAllowance implements FamilyAllowanceModel<FamilyAllowanceDocument> {
    @Field(() => ID)
    id: string;
    @Field(() => FamilyAllowanceType)
    changeType: FamilyAllowanceType;
    @Field(() => FamilyAllowanceStatus)
    status: FamilyAllowanceStatus;
    @Field(() => Employee)
    applicant: EmployeeModel;
    @Field(() => Spouse, {nullable: true})
    spouse?: SpouseModel;
    @Field(() => [OtherParent], {nullable: true})
    otherParents?: OtherParentModel[];
    @Field(() => [Dependent])
    dependents: DependentModel[];
    @Field(() => [Activity])
    history: ActivityModel[];
    @Field(() => [FamilyAllowanceDocument])
    supportingDocuments: FamilyAllowanceDocument[];
    @Field(() => [RequiredInformation])
    requiredInformation: RequiredInformationModel[];
}

@InputType()
export class ReviewInput {
    @Field(() => [String], {nullable: true})
    requiredInformation?: string[]
    @Field({nullable: true})
    comment?: string
}
