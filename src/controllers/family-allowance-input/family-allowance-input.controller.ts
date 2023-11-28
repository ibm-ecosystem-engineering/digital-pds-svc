import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Post} from "@nestjs/common";

import {FamilyAllowance} from "../family-allowance.apitypes";
import {operationIdAddCase} from "../../config";
import {FamilyAllowanceModel} from "../../models";
import {FamilyAllowanceApi} from "../../services";

@ApiTags('family-allowance-input')
@Controller('family-allowance-input')
export class FamilyAllowanceInputController {
    constructor(private readonly service: FamilyAllowanceApi) {}

    @Post()
    @ApiOperation({
        operationId: operationIdAddCase,
        summary: 'Add case',
        description: 'Add a family allowance case'
    })
    @ApiOkResponse({
        type: FamilyAllowance,
        description: "Result of creating a new family allowance case"
    })
    async addFamilyAllowanceCase(@Body() newCase: FamilyAllowance): Promise<FamilyAllowanceModel> {
        return this.service.addFamilyAllowanceCase(newCase);
    }
}