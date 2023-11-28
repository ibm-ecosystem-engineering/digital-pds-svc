import {Provider} from "@nestjs/common";

import {SendEmailApi} from "./send-email.api";
import {buildSmtpConfig, SendEmailSmtp, SmtpConfig} from "./send-email.smtp";
import {SendEmailMock} from "./send-email.mock";

export * from './send-email.api'

let _instance: SendEmailApi
export const sendEmailApi = (): SendEmailApi => {
    if (_instance) {
        return _instance
    }

    try {
        const config: SmtpConfig = buildSmtpConfig()

        return _instance = new SendEmailSmtp(config)
    } catch (error) {
        console.error('Send email not configured: ', {error})

        return _instance = new SendEmailMock()
    }
}

export const sendEmailProvider: Provider = {
    provide: SendEmailApi,
    useFactory: sendEmailApi
}
