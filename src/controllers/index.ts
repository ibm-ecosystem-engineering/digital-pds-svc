import {FamilyAllowanceController} from "./family-allowance";
import {FamilyAllowanceInputController} from "./family-allowance-input";
import {FamilyAllowanceOrchestrateController} from "./family-allowance-orchestrate";
import {FamilyAllowanceSyncController} from "./family-allowance-sync";
import {OpenAPIObject} from "@nestjs/swagger";
import {FamilyAllowanceMinimal} from "./family-allowance.apitypes";
import {IBMSchemaExtension, isSchemaObject} from "../util";
import {ReferenceObject, SchemaObject} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export * from './family-allowance';
export * from './family-allowance-input';
export * from './family-allowance-orchestrate';
export * from './family-allowance-sync';

export const controllers = [
    FamilyAllowanceController,
    FamilyAllowanceInputController,
    FamilyAllowanceOrchestrateController,
    FamilyAllowanceSyncController,
];


export const enhanceApiSpec = (document: OpenAPIObject): OpenAPIObject => {

    addFamilyAllowanceMinimalSchemaExtensions(document.components.schemas['FamilyAllowanceMinimal'])

    return document;
}

const famSchemaExtensions: {[key in keyof FamilyAllowanceMinimal]: IBMSchemaExtension} = {
    changeType: {
        "x-ibm-order": 6,
        "x-ibm-show": true,
    },
    dependentNames: {
        "x-ibm-order": 7,
        "x-ibm-show": true,
    },
    employeeId: {
        "x-ibm-order": 4,
        "x-ibm-show": true,
    },
    firstName: {
        "x-ibm-order": 2,
        "x-ibm-show": true,
    },
    id: {
        "x-ibm-order": 1,
        "x-ibm-show": true,
    },
    lastName: {
        "x-ibm-order": 3,
        "x-ibm-show": true,
    },
    status: {
        "x-ibm-order": 5,
        "x-ibm-show": true,
    },
}

const addFamilyAllowanceMinimalSchemaExtensions = (schema: SchemaObject | ReferenceObject) => {
    if (!schema) {
        console.log('FamilyAllowanceMinimal schema not defined')
        return
    }

    if (!isSchemaObject(schema)) {
        console.log('FamilyAllowanceMinimal object is not a schema')
        return
    }

    Object.keys(famSchemaExtensions)
        .filter(key => !!(schema.properties[key]))
        .forEach(key => Object.assign(schema.properties[key], famSchemaExtensions[key]))
}