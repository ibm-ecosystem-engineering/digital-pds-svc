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
import {
    ApiBasicAuth,
    ApiExtension,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiProperty,
    ApiQuery,
    ApiTags
} from "@nestjs/swagger";
import {getType} from "mime";

import {FamilyAllowanceApi} from "../../services";
import {
    ActivityModel,
    DependentModel,
    DocumentModel,
    DocumentWithContentModel, FamilyAllowanceBasicModel,
    FamilyAllowanceModel,
    FamilyAllowanceStatus
} from "../../models";
import * as inspector from "inspector";

class Dependent implements DependentModel {
    @ApiProperty({title: 'Birth Date'})
    birthDate: string;
    @ApiProperty({title: 'First Name'})
    firstName: string;
    @ApiProperty({title: 'Government ID'})
    governmentId: string;
    @ApiProperty({title: 'Last Name'})
    lastName: string;
}

class Activity implements ActivityModel {
    @ApiProperty()
    actor: string;
    @ApiProperty()
    comment: string;
    @ApiProperty()
    timestamp: string;
    @ApiProperty()
    type: string;
}

class Document implements DocumentModel {
    @ApiProperty()
    name: string;
    @ApiProperty()
    type: string;
    @ApiProperty()
    url: string;
    @ApiProperty()
    id: string;
}

interface ListResult<T> {
    instances: T[]
}

class FamilyAllowanceListResult implements ListResult<FamilyAllowanceMinimal> {
    @ApiProperty({title: 'Results', type: () => [FamilyAllowanceMinimal]})
    instances: FamilyAllowanceMinimal[]
}

class FamilyAllowanceDocListResult implements ListResult<Document> {
    @ApiProperty({title: 'Results', type: () => [Document]})
    instances: Document[];
}

class FamilyAllowanceHistoryListResult implements ListResult<Activity> {
    @ApiProperty({title: 'Results', type: () => [Activity]})
    instances: Activity[];
}

class FamilyAllowanceMinimal {
    @ApiProperty({title: 'Change type'})
    changeType: string;
    @ApiProperty({title: 'Dependent name'})
    dependentName: string;
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

class FamilyAllowanceBasic implements FamilyAllowanceBasicModel {
    @ApiProperty({title: 'Change Type'})
    changeType: string;
    @ApiProperty({type: () => Dependent})
    dependent: DependentModel;
    @ApiProperty({title: 'Employee ID'})
    employeeId: string;
    @ApiProperty({title: 'First Name'})
    firstName: string;
    @ApiProperty({title: 'Government ID'})
    governmentId: string;
    @ApiProperty({title: 'ID'})
    id: string;
    @ApiProperty({title: 'Last Name'})
    lastName: string;
    @ApiProperty({title: 'Status', enum: FamilyAllowanceStatus})
    status: FamilyAllowanceStatus;
}

class FamilyAllowance extends FamilyAllowanceBasic implements FamilyAllowanceModel {
    @ApiProperty({type: () => [Activity]})
    history: ActivityModel[];
    @ApiProperty({type: () => [Document]})
    supportingDocuments: DocumentModel[];
}

const minimizeFamilyAllowanceModel = (input: FamilyAllowanceModel): FamilyAllowanceMinimal => {
    return {
        id: input.id,
        changeType: input.changeType,
        employeeId: input.employeeId,
        firstName: input.firstName,
        lastName: input.lastName,
        status: input.status,
        dependentName: `${input.dependent.firstName} ${input.dependent.lastName}`,
    }
}

const familyAllowanceToFamilyAllowanceBasic = (input: FamilyAllowanceModel): FamilyAllowanceBasicModel => {
    return {
        id: input.id,
        changeType: input.changeType,
        employeeId: input.employeeId,
        firstName: input.firstName,
        lastName: input.lastName,
        status: input.status,
        governmentId: input.governmentId,
        dependent: input.dependent,
    }
}

const familyAllowanceToDocs = (input: FamilyAllowanceModel): DocumentModel[] => {
    return (input.supportingDocuments || [])
        .map(doc => ({name: doc.name, type: doc.type, id: doc.id, url: doc.url}))
}

const familyAllowanceToHistory = (input: FamilyAllowanceModel): ActivityModel[] => {
    return input.history || []
}

const filterSupportingDocuments = (docs: DocumentModel[]): DocumentModel[] => {
    return docs.map(doc => {
        const val = Object.assign({}, doc) as DocumentWithContentModel

        delete val.content

        return val
    })
}
const filterResult = (result: FamilyAllowanceModel): FamilyAllowanceModel => {
    return Object.assign({}, result, {supportingDocuments: filterSupportingDocuments(result.supportingDocuments)})
}

@ApiTags('family-allowance')
@ApiExtension('x-ibm', {annotations: 'true', 'application-id': 'family-allowance'})
@Controller('family-allowance')
export class FamilyAllowanceController {
    constructor(private readonly service: FamilyAllowanceApi) {}

    @Post()
    @ApiOperation({
        operationId: 'add-family-allowance-case',
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
        operationId: 'list-family-allowance-cases',
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
    async listFamilyAllowanceCase(@Query('status') status?: FamilyAllowanceStatus): Promise<FamilyAllowanceListResult> {
        return this.service
            .listFamilyAllowanceCases(status)
            .then(result => result.map(minimizeFamilyAllowanceModel))
            .then(instances => ({instances}))
    }

    @Get(':id')
    @ApiOperation({
        operationId: 'get-family-allowance-case',
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

    @Get(':id/docs')
    @ApiOperation({
        operationId: 'get-family-allowance-case-docs',
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
        operationId: 'get-family-allowance-case-history',
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
        operationId: 'update-family-allowance-case',
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
        operationId: 'family-allowance-case-needs-info',
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
        operationId: 'send-family-allowance-case-to-compensation',
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
        operationId: 'approve-family-allowance-case',
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
        operationId: 'close-family-allowance-case',
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
        operationId: 'add-family-allowance-case-document',
        summary: 'Add document to case',
        description: 'Add a document to the family allowance case identified by the provided id'
    })
    @UseInterceptors(FileInterceptor('file'))
    async addDocumentToFamilyAllowanceCase(@Param('id') id: string, @Body() input: Document, @UploadedFile() file: Express.Multer.File): Promise<FamilyAllowanceModel> {
        return this.service.addDocumentToFamilyAllowanceCase(id, input, file.buffer)
    }

    @Get(':id/doc/:docId/:name')
    @ApiOperation({
        operationId: 'download-family-allowance-case-document',
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