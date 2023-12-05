import {SchemaObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export const isSchemaObject = (val: unknown): val is SchemaObject => {
    return !!val && !!(val as SchemaObject).properties
}

export interface IBMSchemaExtension {
    'x-ibm-order'?: number;
    'x-ibm-show'?: boolean;
}
