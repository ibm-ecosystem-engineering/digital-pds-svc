import {Provider} from "@nestjs/common";
import {provider as helloWorldProvider} from "./hello-world";
import {familyAllowanceProvider} from "./family-allowance";

export * from './hello-world';
export * from './family-allowance';

export const providers: Provider[] = [
    helloWorldProvider,
    familyAllowanceProvider
];
