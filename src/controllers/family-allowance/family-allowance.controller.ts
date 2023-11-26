import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Res,
    StreamableFile,
    UploadedFile,
    UseInterceptors
} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiExtension, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags} from "@nestjs/swagger";
import {getType} from "mime";

import {FamilyAllowanceApi} from "../../services";
import {FamilyAllowanceBasicModel, FamilyAllowanceModel, FamilyAllowanceStatus} from "../../models";
import {
    buildSkillId,
    operationIdAddCase,
    operationIdAddDocument,
    operationIdApproveCase,
    operationIdCloseCase,
    operationIdDownloadDocument,
    operationIdGetCase,
    operationIdGetCaseDocuments,
    operationIdGetCaseHistory, operationIdGetCaseSummary,
    operationIdListCases,
    operationIdNeedsInfo,
    operationIdSendToCompensationOffice,
    operationIdUpdateCase
} from "../../config";
import {
    FamilyAllowance,
    FamilyAllowanceBasic,
    FamilyAllowanceDocListResult,
    FamilyAllowanceDocument,
    FamilyAllowanceHistoryListResult,
    FamilyAllowanceListResult,
    FamilyAllowanceSummary,
    familyAllowanceToDocs,
    familyAllowanceToFamilyAllowanceBasic,
    familyAllowanceToHistory,
    minimizeFamilyAllowanceModel
} from "./family-allowance.apitypes";

@ApiTags('family-allowance')
@ApiExtension('x-ibm', {annotations: 'true', 'application-id': 'family-allowance'})
@Controller('family-allowance')
export class FamilyAllowanceController {
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

    @Get()
    @ApiOperation({
        operationId: operationIdListCases,
        summary: 'List cases',
        description: 'List the family allowance cases'
    })
    @ApiQuery({
        name: "status",
        enum: FamilyAllowanceStatus,
        description: "The status filter for the list",
        required: false,
        explode: true,
    })
    @ApiOkResponse({
        type: FamilyAllowanceListResult,
        description: "Returns list of family allowance cases",
    })
    @ApiExtension('x-ibm', {
        'next-actions': [{
            skill_id: buildSkillId(operationIdGetCase),
            utterance: 'show the family allowance case details'
        }],
        'nl-intent-examples': [
            'get family allowance cases',
            'list family allowance cases'
        ]
    })
    async listFamilyAllowanceCase(@Query('status') status?: FamilyAllowanceStatus): Promise<FamilyAllowanceListResult> {
        return this.service
            .listFamilyAllowanceCases(status)
            .then(result => result.map(minimizeFamilyAllowanceModel))
            .then(instances => ({instances}))
    }

    @Get(':id')
    @ApiOperation({
        operationId: operationIdGetCase,
        summary: 'Get case details',
        description: 'Get the family allowance case for the provided id'
    })
    @ApiParam({
        name: 'id',
        description: 'The id of the case'
    })
    @ApiOkResponse({
        type: FamilyAllowanceBasic,
        description: "Returns selected case"
    })
    @ApiExtension('x-ibm', {
        'next-actions': [{
            skill_id: buildSkillId(operationIdUpdateCase),
            utterance: 'update the family allowance case'
        }, {
            skill_id: buildSkillId(operationIdNeedsInfo),
            utterance: 'family allowance case needs info'
        }, {
            skill_id: buildSkillId(operationIdSendToCompensationOffice),
            utterance: 'send the family allowance case to compensation office'
        }, {
            skill_id: buildSkillId(operationIdCloseCase),
            utterance: 'close the family allowance case'
        }]
    })
    async getFamilyAllowanceCase(@Param('id') id: string): Promise<FamilyAllowanceBasicModel> {
        console.log('Getting family allowance case: ' + id);

        return this.service
            .getFamilyAllowanceCase(id)
            .then(familyAllowanceToFamilyAllowanceBasic)
            .then(result => {
                console.log('/result: ', result)
                return result
            })
    }

    @Get(':id/summary')
    @ApiOperation({
        operationId: operationIdGetCaseSummary,
        summary: 'Summarize case details',
        description: 'Get the family allowance case summary for the provided id'
    })
    @ApiParam({
        name: 'id',
        description: 'The id of the case'
    })
    @ApiOkResponse({
        type: FamilyAllowanceSummary,
        description: "Returns selected case summary"
    })
    @ApiExtension('x-ibm', {
        'next-actions': [{
            skill_id: buildSkillId(operationIdUpdateCase),
            utterance: 'update the family allowance case'
        }, {
            skill_id: buildSkillId(operationIdNeedsInfo),
            utterance: 'family allowance case needs info'
        }, {
            skill_id: buildSkillId(operationIdSendToCompensationOffice),
            utterance: 'send the family allowance case to compensation office'
        }, {
            skill_id: buildSkillId(operationIdCloseCase),
            utterance: 'close the family allowance case'
        }]
    })
    async getFamilyAllowanceCaseSummary(@Param('id') id: string): Promise<FamilyAllowanceSummary> {
        console.log('Getting family allowance case summary: ' + id);

        return this.service
            .getFamilyAllowanceCaseSummary(id)
            .then(summary => ({summary}))
    }

    @Get(':id/docs')
    @ApiOperation({
        operationId: operationIdGetCaseDocuments,
        summary: 'Get case documents',
        description: 'Get the family allowance docs for the provided id'
    })
    @ApiParam({
        name: 'id',
        description: 'The id of the case'
    })
    @ApiOkResponse({
        type: FamilyAllowanceDocListResult,
        description: "Returns docs for selected case"
    })
    async getFamilyAllowanceDocs(@Param('id') id: string): Promise<FamilyAllowanceDocListResult> {
        return this.service
            .getFamilyAllowanceCase(id)
            .then(familyAllowanceToDocs)
            .then(instances => ({instances}))
    }

    @Get(':id/history')
    @ApiOperation({
        operationId: operationIdGetCaseHistory,
        summary: 'Get case history',
        description: 'Get the family allowance history for the provided id'
    })
    @ApiParam({
        name: 'id',
        description: 'The id of the case'
    })
    @ApiOkResponse({
        type: FamilyAllowanceHistoryListResult,
        description: "Returns history for selected case"
    })
    async getFamilyAllowanceHistory(@Param('id') id: string): Promise<FamilyAllowanceHistoryListResult> {
        return this.service
            .getFamilyAllowanceCase(id)
            .then(familyAllowanceToHistory)
            .then(instances => ({instances}))
    }

    @Post(':id')
    @ApiOperation({
        operationId: operationIdUpdateCase,
        summary: 'Update case',
        description: 'Update the family allowance case identified by the provided id'
    })
    @ApiOkResponse({
        type: FamilyAllowance,
        description: "Returns updated case"
    })
    async updateFamilyAllowanceCase(@Param('id') id: string, @Body() update: Partial<FamilyAllowanceModel>): Promise<FamilyAllowanceModel> {
        return this.service.updateFamilyAllowanceCase(id, update);
    }

    @Get(':id/needsInfo')
    @ApiOperation({
        operationId: operationIdNeedsInfo,
        summary: 'Case needs info',
        description: 'Mark the family allowance case identified by the provided id as needing info'
    })
    @ApiQuery({
        name: 'comment',
        required: false,
    })
    @ApiOkResponse({
        type: FamilyAllowance,
        description: "Returns updated case"
    })
    async needsInfoFamilyAllowanceCase(@Param('id') id: string, @Query('comment') comment?: string): Promise<FamilyAllowanceModel> {
        return this.service.reviewFamilyAllowanceCase(id, true, comment);
    }

    @Get(':id/sendToCompensation')
    @ApiOperation({
        operationId: operationIdSendToCompensationOffice,
        summary: 'Send case to compensation office',
        description: 'Send the family allowance case identified by the provided id to the compensation office'
    })
    @ApiQuery({
        name: 'comment',
        required: false,
    })
    @ApiOkResponse({
        type: FamilyAllowance,
        description: "Returns updated case"
    })
    async reviewFamilyAllowanceCase(@Param('id') id: string, @Query('comment') comment?: string): Promise<FamilyAllowanceModel> {
        return this.service.reviewFamilyAllowanceCase(id, false, comment);
    }

    @Get(':id/approve')
    @ApiOperation({
        operationId: operationIdApproveCase,
        summary: 'Approve case',
        description: 'Approve the family allowance case identified by the provided id'
    })
    @ApiOkResponse({
        type: FamilyAllowance,
        description: "Returns updated case"
    })
    async approveFamilyAllowanceCase(@Param('id') id: string): Promise<FamilyAllowanceModel> {
        return this.service.approveFamilyAllowanceCase(id);
    }

    @Get(':id/close')
    @ApiOperation({
        operationId: operationIdCloseCase,
        summary: 'Close case',
        description: 'Close the family allowance case identified by the provided id'
    })
    @ApiOkResponse({
        type: FamilyAllowance,
        description: "Returns updated case"
    })
    async closeCase(@Param('id') id: string, @Query('resolution') resolution: string): Promise<FamilyAllowanceModel> {
        return this.service.closeCase(id, resolution);
    }

    @Post(':id/upload')
    @ApiOperation({
        operationId: operationIdAddDocument,
        summary: 'Add document to case',
        description: 'Add a document to the family allowance case identified by the provided id'
    })
    @UseInterceptors(FileInterceptor('file'))
    async addDocumentToFamilyAllowanceCase(@Param('id') id: string, @Body() input: FamilyAllowanceDocument, @UploadedFile() file: Express.Multer.File): Promise<FamilyAllowanceModel> {
        return this.service.addDocumentToFamilyAllowanceCase(id, input, file.buffer)
    }

    @Get(':id/doc/:docId/:name')
    @ApiOperation({
        operationId: operationIdDownloadDocument,
        summary: 'Download document',
        description: 'Download a document from the family allowance case identified by the provided id'
    })
    async downloadFileByName(
        @Param('id') id: string,
        @Param('docId') documentId: string,
        @Param('name') name: string,
        @Res({ passthrough: true }) res: Response
    ): Promise<StreamableFile> {
        const document = await this.service.getDocumentForFamilyAllowanceCase(id, documentId)

        const filename = document.name || name;

        (res as any).set({
            'Content-Type': getType(filename),
            'Content-Disposition': `attachment; filename="${filename}"`
        })

        return new StreamableFile(document.content, {type: getType(filename)});
    }

}
