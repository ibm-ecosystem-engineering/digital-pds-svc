import {Provider} from "@nestjs/common";
import {HelloWorldResolver} from "./hello-world";
import {FamilyAllowanceResolver} from "./family-allowance";

export * from './hello-world'
export * from './family-allowance'

export const providers: Provider[] = [
    HelloWorldResolver,
    FamilyAllowanceResolver
]
