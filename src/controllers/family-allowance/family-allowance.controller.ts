import {Body, Controller, Get, Param, Post, Res, StreamableFile, UploadedFile, UseInterceptors} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiOkResponse, ApiOperation, ApiParam, ApiTags} from "@nestjs/swagger";
import {getType} from "mime";

import {FamilyAllowance, FamilyAllowanceDocument, filterSupportingDocuments} from "../family-allowance.apitypes";
import {operationIdAddDocument, operationIdDownloadDocument} from "../../config";
import {FamilyAllowanceModel} from "../../models";
import {FamilyAllowanceApi} from "../../services";

@ApiTags('family-allowance')
@Controller('family-allowance')
export class FamilyAllowanceController {
    @Get(':id/doc/:docId/:name')
    @ApiParam({
        name: 'id',
        description: 'The id of the case'
    })
    @ApiParam({
        name: 'docId',
        description: 'The id of the document within the case'
    })
    @ApiParam({
        name: 'name',
        description: 'The name of the document',
        required: true
    })
    @ApiOperation({
        operationId: operationIdDownloadDocument,
        summary: 'Download document',
        description: 'Download a document from the family allowance case identified by the provided id'
    })
    async downloadFileByName(
        @Param('id') id: string,
        @Param('docId') documentId: string,
        @Param('name') name: string,
        @Res({ passthrough: true }) res: Response,
    ): Promise<StreamableFile> {
        const document = await this.service.getDocumentForFamilyAllowanceCase(id, documentId)

        const filename = document.name || name;

        (res as any).set({
            'Content-Type': getType(filename),
            'Content-Disposition': `attachment; filename="${filename}"`
        })

        return new StreamableFile(document.content, {type: getType(filename)});
    }

    constructor(private readonly service: FamilyAllowanceApi) {}

    @Post(':id/upload')
    @ApiOperation({
        operationId: operationIdAddDocument,
        summary: 'Add document to case',
        description: 'Add a document to the family allowance case identified by the provided id'
    })
    @ApiParam({
        name: 'id',
        description: 'The id of the case'
    })
    @ApiOkResponse({
        type: FamilyAllowance,
        description: "Returns updated case"
    })
    @UseInterceptors(FileInterceptor('file'))
    async addDocumentToFamilyAllowanceCase(@Param('id') id: string, @Body() input: FamilyAllowanceDocument, @UploadedFile() file: Express.Multer.File): Promise<FamilyAllowanceModel> {
        return this.service
            .addDocumentToFamilyAllowanceCase(id, input, file.buffer)
            .then((familyAllowanceCase: FamilyAllowanceModel) => {
                return Object.assign(
                    {},
                    familyAllowanceCase,
                    {supportingDocuments: filterSupportingDocuments(familyAllowanceCase.supportingDocuments)}
                )
            })
    }

}
