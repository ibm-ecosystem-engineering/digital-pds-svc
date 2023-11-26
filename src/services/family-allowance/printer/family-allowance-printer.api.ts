import {FamilyAllowanceModel} from "../../../models";

export abstract class FamilyAllowancePrinterApi {
    abstract print(data: FamilyAllowanceModel): string;
}
