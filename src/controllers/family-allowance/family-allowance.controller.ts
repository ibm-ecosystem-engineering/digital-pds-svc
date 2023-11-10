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
import {ApiOkResponse, ApiProperty, ApiQuery, ApiTags} from "@nestjs/swagger";
import {getType} from "mime";

import {FamilyAllowanceApi} from "../../services";
import {ActivityModel, DependentModel, DocumentModel, FamilyAllowanceModel, FamilyAllowanceStatus} from "../../models";

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

@ApiTags('family-allowance')
@Controller('family-allowance')
export class FamilyAllowanceController {
    constructor(private readonly service: FamilyAllowanceApi) {}

    @ApiOkResponse({
        type: FamilyAllowance,
        description: "Result of creating a new family allowance case"
    })
    @Post()
    async addFamilyAllowanceCase(@Body() newCase: FamilyAllowance): Promise<FamilyAllowanceModel> {
        return this.service.addFamilyAllowanceCase(newCase);
    }

    @ApiQuery({
        name: "status",
        enum: FamilyAllowanceStatus,
        description: "The status filter for the list",
        required: false
    })
    @ApiOkResponse({
        type: [FamilyAllowance],
        description: "Returns list of family allowance cases",
    })
    @Get()
    async listFamilyAllowanceCase(@Query('status') status?: FamilyAllowanceStatus): Promise<FamilyAllowanceModel[]> {
        return this.service.listFamilyAllowanceCases(status);
    }

    @ApiOkResponse({
        type: FamilyAllowance,
        description: "Returns selected case"
    })
    @Get(':id')
    async getFamilyAllowanceCase(@Param('id') id: string): Promise<FamilyAllowanceModel> {
        return this.service.getFamilyAllowanceCase(id);
    }

    @ApiOkResponse({
        type: FamilyAllowance,
        description: "Returns updated case"
    })
    @Post(':id')
    async updateFamilyAllowanceCase(@Param('id') id: string, @Body() update: Partial<FamilyAllowanceModel>): Promise<FamilyAllowanceModel> {
        return this.service.updateFamilyAllowanceCase(id, update);
    }

    @ApiOkResponse({
        type: FamilyAllowance,
        description: "Returns updated case"
    })
    @Get(':id/review')
    async reviewFamilyAllowanceCase(@Param('id') id: string, @Query('needsInfo') needsInfo?: boolean): Promise<FamilyAllowanceModel> {
        return this.service.reviewFamilyAllowanceCase(id, needsInfo);
    }

    @ApiOkResponse({
        type: FamilyAllowance,
        description: "Returns updated case"
    })
    @Get(':id/approve')
    async approveFamilyAllowanceCase(@Param('id') id: string): Promise<FamilyAllowanceModel> {
        return this.service.approveFamilyAllowanceCase(id);
    }

    @ApiOkResponse({
        type: FamilyAllowance,
        description: "Returns updated case"
    })
    @Get(':id/close')
    async closeCase(id: string, resolution: string): Promise<FamilyAllowanceModel> {
        return this.service.closeCase(id, resolution);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async addDocumentToFamilyAllowanceCase(@Param('id') id: string, @Body() input: Document, @UploadedFile() file: Express.Multer.File): Promise<FamilyAllowanceModel> {
        return this.service.addDocumentToFamilyAllowanceCase(id, input, file.buffer)
    }

    @Get(':id/doc/:docId/:name')
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