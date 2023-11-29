import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Controller, Get} from "@nestjs/common";
import {operationIdSyncCases} from "../../config";
import {FamilyAllowanceApi} from "../../services";
import {FamilyAllowanceModel, FamilyAllowanceStatus} from "../../models";
import {Ak71Api, Ak71FamilyAllowanceModel, Ak71FamilyAllowanceStatus} from "../../services/ak71";

export class FamilyAllowanceSyncResult {
    missingCompensationOfficeIdCount: number;
    failedRetrieveCount: number;
    updatedCaseCount: number;
}

interface FamilyAllowanceCasePair {
    pdsCase: FamilyAllowanceModel;
    ak71Case?: Ak71FamilyAllowanceModel;
    ak71Error?: Error;
}

@ApiTags('family-allowance-sync')
@Controller('family-allowance-sync')
export class FamilyAllowanceSyncController {

    constructor(
        private readonly service: FamilyAllowanceApi,
        private readonly ak71Service: Ak71Api,
    ) {}

    @Get()
    @ApiOperation({
        operationId: operationIdSyncCases,
        summary: 'Sync cases',
        description: 'Sync family allowance cases'
    })
    @ApiOkResponse({
        type: FamilyAllowanceSyncResult,
        description: "Result of creating a new family allowance case"
    })
    async syncFamilyAllowanceCases(): Promise<FamilyAllowanceSyncResult> {

        const cases = await this.service.listFamilyAllowanceCases(FamilyAllowanceStatus.PendingApproval)

        const casesWithCompensationOfficeId = cases.filter(val => !!val.compensationOfficeId)
        const missingCompensationOfficeIdCount: number = cases.filter(val => !val.compensationOfficeId).length

        const compensationOfficeCases = await this.lookupAk71Status(casesWithCompensationOfficeId)

        const successfullyRetrievedCases: FamilyAllowanceCasePair[] = compensationOfficeCases
            .filter(val => !!val.ak71Case)
        const failedRetrievedCases: FamilyAllowanceCasePair[] = compensationOfficeCases
            .filter(val => !val.ak71Case)

        const updatedCases: FamilyAllowanceCasePair[] = successfullyRetrievedCases
            .filter(val => val.ak71Case.status !== Ak71FamilyAllowanceStatus.Pending)

        await Promise.all(
            updatedCases.map(this.updateFamilyAllowanceCase.bind(this))
        )

        return {
            updatedCaseCount: updatedCases.length,
            failedRetrieveCount: failedRetrievedCases.length,
            missingCompensationOfficeIdCount,
        }
    }

    async lookupAk71Status(pdsCases: FamilyAllowanceModel[]): Promise<FamilyAllowanceCasePair[]> {
        const ak71Cases: Ak71FamilyAllowanceModel[] = await this.ak71Service
            .getAk71Cases(pdsCases.map(val => val.compensationOfficeId))

        return pdsCases.map(pdsCase => {
            const filteredCases: Ak71FamilyAllowanceModel[] = ak71Cases.filter(ak71Case => ak71Case.id === pdsCase.compensationOfficeId)

            const ak71Case: Ak71FamilyAllowanceModel = filteredCases.length > 0 ? filteredCases[0] : undefined

            return {pdsCase, ak71Case}
        })
    }

    async updateFamilyAllowanceCase(pair: FamilyAllowanceCasePair): Promise<FamilyAllowanceModel> {
        const id = pair.pdsCase.id
        const status: FamilyAllowanceStatus | undefined = mapAk71Status(pair.ak71Case.status)

        if (!status) {
            console.error('Unknown Ak71 status: ' + pair.ak71Case.status)
        }

        if (status === FamilyAllowanceStatus.NeedsInfo) {
            return this.service.reviewFamilyAllowanceCase(id, ['AK71 needs info'], 'Returned from AK71')
        } else {
            return this.service.updateFamilyAllowanceStatus(id, status)
        }
    }
}

const mapAk71Status = (status: Ak71FamilyAllowanceStatus): FamilyAllowanceStatus | undefined => {
    switch (status) {
        case Ak71FamilyAllowanceStatus.Approved:
            return FamilyAllowanceStatus.Approved
        case Ak71FamilyAllowanceStatus.Denied:
            return FamilyAllowanceStatus.Denied
        case Ak71FamilyAllowanceStatus.NeedsInfo:
            return FamilyAllowanceStatus.NeedsInfo
        default:
            return
    }
}