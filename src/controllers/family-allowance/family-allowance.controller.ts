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
import {ApiBasicAuth, ApiExtension, ApiOkResponse, ApiOperation, ApiProperty, ApiQuery, ApiTags} from "@nestjs/swagger";
import {getType} from "mime";

import {FamilyAllowanceApi} from "../../services";
import {ActivityModel, DependentModel, DocumentModel, FamilyAllowanceModel, FamilyAllowanceStatus} from "../../models";
import * as inspector from "inspector";

class Dependent implements DependentModel {
    @ApiProperty()
    birthDate: string;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    governmentId: string;
    @ApiProperty()
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

class FamilyAllowance implements FamilyAllowanceModel {
    @ApiProperty()
    changeType: string;
    @ApiProperty({type: () => Dependent})
    dependent: DependentModel;
    @ApiProperty()
    employeeId: string;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    governmentId: string;
    @ApiProperty({type: () => [Activity]})
    history: ActivityModel[];
    @ApiProperty()
    id: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty({enum: FamilyAllowanceStatus})
    status: FamilyAllowanceStatus;
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

@ApiTags('family-allowance')
@ApiExtension('x-ibm', {annotations: 'true', 'application-id': 'family-allowance'})
@Controller('family-allowance')
export class FamilyAllowanceController {
    constructor(private readonly service: FamilyAllowanceApi) {}

    @Post()
    @ApiOperation({
        operationId: 'add-case',
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
        operationId: 'list-cases',
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
        type: [FamilyAllowanceMinimal],
        description: "Returns list of family allowance cases",
    })
    async listFamilyAllowanceCase(@Query('status') status?: FamilyAllowanceStatus): Promise<FamilyAllowanceMinimal[]> {
        return this.service
            .listFamilyAllowanceCases(status)
            .then(result => result.map(minimizeFamilyAllowanceModel))
    }

    @Get(':id')
    @ApiOperation({
        operationId: 'get-case',
        summary: 'Get case by id',
        description: 'Get the family allowance case for the provided id'
    })
    @ApiOkResponse({
        type: FamilyAllowance,
        description: "Returns selected case"
    })
    async getFamilyAllowanceCase(@Param('id') id: string): Promise<FamilyAllowanceModel> {
        return this.service.getFamilyAllowanceCase(id);
    }

    @Post(':id')
    @ApiOperation({
        operationId: 'update-case',
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

    @Get(':id/review')
    @ApiOperation({
        operationId: 'review-case',
        summary: 'Review case',
        description: 'Review the family allowance case identified by the provided id'
    })
    @ApiOkResponse({
        type: FamilyAllowance,
        description: "Returns updated case"
    })
    async reviewFamilyAllowanceCase(@Param('id') id: string, @Query('needsInfo') needsInfo?: boolean): Promise<FamilyAllowanceModel> {
        return this.service.reviewFamilyAllowanceCase(id, needsInfo);
    }

    @Get(':id/approve')
    @ApiOperation({
        operationId: 'approve-case',
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
        operationId: 'close-case',
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
        operationId: 'add-document',
        summary: 'Add document to case',
        description: 'Add a document to the family allowance case identified by the provided id'
    })
    @UseInterceptors(FileInterceptor('file'))
    async addDocumentToFamilyAllowanceCase(@Param('id') id: string, @Body() input: Document, @UploadedFile() file: Express.Multer.File): Promise<FamilyAllowanceModel> {
        return this.service.addDocumentToFamilyAllowanceCase(id, input, file.buffer)
    }

    @Get(':id/doc/:docId/:name')
    @ApiOperation({
        operationId: 'download-document',
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