import {FamilyAllowanceController} from "./family-allowance";
import {FamilyAllowanceInputController} from "./family-allowance-input";
import {FamilyAllowanceOrchestrateController} from "./family-allowance-orchestrate";
import {FamilyAllowanceSyncController} from "./family-allowance-sync";

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
