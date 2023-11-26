import {Args, ID, Mutation, Query, Resolver} from "@nestjs/graphql";
import {FamilyAllowance, ReviewInput} from "../../graphql-types";
import {FamilyAllowanceApi} from "../../services";
import {FamilyAllowanceModel, FamilyAllowanceStatusFilter, mapFamilyAllowanceStatus} from "../../models";

@Resolver(() => FamilyAllowance)
export class FamilyAllowanceResolver {

    constructor(private readonly service: FamilyAllowanceApi) {}

    @Query(() => [FamilyAllowance])
    async listFamilyAllowanceCases(
        @Args('status', { nullable: true, type: () => FamilyAllowanceStatusFilter }) filter?: FamilyAllowanceStatusFilter
    ): Promise<FamilyAllowanceModel[]> {
        const status = mapFamilyAllowanceStatus(filter)

        return this.service.listFamilyAllowanceCases(status)
    }

    @Query(() => FamilyAllowance)
    async getFamilyAllowanceCase(
        @Args('id', {type: () => ID}) id: string
    ): Promise<FamilyAllowanceModel> {
        return this.service.getFamilyAllowanceCase(id)
    }

    @Mutation(() => FamilyAllowance)
    async updateRequiredInformation(
        @Args('caseId', {type: () => ID}) caseId: string,
        @Args('infoId', {type: () => ID}) infoId: string,
        @Args('completed', {type: () => Boolean}) completed: boolean
    ): Promise<FamilyAllowanceModel> {
        return this.service.updateRequiredInformationStatus(caseId, infoId, completed)
    }

    @Mutation(() => FamilyAllowance)
    async markFamilyAllowanceCaseReadyForReview(
        @Args('id', {type: () => ID}) id: string
    ): Promise<FamilyAllowanceModel> {
        return this.service.markFamilyAllowanceCaseReadyForReview(id)
    }

    @Mutation(() => FamilyAllowance)
    async reviewFamilyAllowanceCase(
        @Args('id', {type: () => ID}) id: string,
        @Args('input', {type: () => ReviewInput}) input: ReviewInput
    ): Promise<FamilyAllowanceModel> {
        return this.service.reviewFamilyAllowanceCase(id, input.requiredInformation, input.comment)
    }
}
