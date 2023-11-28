import {Provider} from "@nestjs/common";

import {provider as helloWorldProvider} from "./hello-world";
import {ak71Provider} from "./ak71";
import {familyAllowanceProvider} from "./family-allowance";
import {familyAllowanceStatusEventHandlerProvider} from "./family-allowance-event-handler";
import {sendEmailProvider} from "./send-email";

export * from './hello-world';
export * from './ak71'
export * from './family-allowance';
export * from './send-email';
export * from './family-allowance-event-handler'

export const providers: Provider[] = [
    helloWorldProvider,
    familyAllowanceProvider,
    familyAllowanceStatusEventHandlerProvider,
    ak71Provider,
    sendEmailProvider
];
