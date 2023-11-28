import {createTransport, Transporter} from 'nodemailer';

import {SendEmailApi} from "./send-email.api";
import {buildCaseUrl} from "../../util";
import {RequiredInformationModel} from "../../models";

export interface SmtpConfig {
    host: string;
    port: number;
    auth: {
        user: string;
        pass: string;
    }
}

export const buildSmtpConfig = (): SmtpConfig => {
    const config = {
        host: process.env['SMTP_HOST'] || 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env['SMTP_USER'],
            pass: process.env['SMTP_PASSWORD'],
        },
    }

    if (!config.auth.user || !config.auth.pass) {
        throw new Error('Gmail auth configuration not provided')
    }

    return config
}


export class SendEmailSmtp implements SendEmailApi {
    service: Transporter

    constructor(config: SmtpConfig) {
        this.service = createTransport(config)

        this.service.verify()
            .then(() => console.log('Smtp client successfully configured!'))
            .catch(console.error);
    }

    async sendNeedsInfoEmail(to: string, caseId: string, requiredInfo: RequiredInformationModel[]): Promise<boolean> {
        const caseUrl = buildCaseUrl(caseId)

        const needsInfo: string[] = requiredInfo.map(info => info.description)

        const {text, html} = buildNeedInfoEmailContent(caseUrl, needsInfo)

        return this.service.sendMail({
            from: '"Digital PDS" <ibmdigitalpds@gmail.com>', // sender address
            to, // list of receivers
            subject: "Family Allowance case - Information needed", // subject line
            text, // plain text body
            html, // html body
        }).then(info => {
            console.log({info});
            return true
        }).catch(err => {
            console.error(err)
            return false
        });
    }
}

const buildNeedInfoEmailContent = (caseUrl: string, needsInfo: string[]): {text: string, html: string} => {
    const text = `
We have reviewed your Family Allowance application and have identified the following missing information:

${needsInfo.map(val => `- ${val}`).join('\n')}

Use the link below to provide the necessary information so we can complete your application: ${caseUrl}

Thank you,
IBM Payroll
`
    const html = `
<p>
We have reviewed your Family Allowance application and have identified the following missing information:
</p>
<ul>
${needsInfo.map(val => `<li>${val}</li>`).join('\n')}
</ul>
<p>
Use the link below to provide the necessary information so we can complete your application - <a href="${caseUrl}">Digital PDS</a>
</p>
<p>
Thank you,
IBM Payroll
</p>
`

    return {text, html}
}
