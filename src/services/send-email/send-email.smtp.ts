import {createTransport, Transporter} from 'nodemailer';

import {SendEmailApi} from "./send-email.api";
import {RequiredInformationModel} from "../../models";
import {buildCaseUrl} from "../../util";

export interface SmtpConfig {
    host: string;
    port: number;
    auth: {
        user: string;
        pass: string;
    }
}

interface EmailContent {
    text: string;
    html: string;
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

    async sendPendingBookingsEmail(to: string, caseId: string): Promise<boolean> {
        const caseUrl = buildCaseUrl(caseId)

        const {text, html} = buildPendingBookingsEmailContent(caseUrl)

        return this.service.sendMail({
            from: '"Digital PDS" <ibmdigitalpds@gmail.com>', // sender address
            to, // list of receivers
            subject: "Family Allowance case - Bookings", // subject line
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

    async sendApprovedEmail(to: string, caseId: string): Promise<boolean> {
        const caseUrl = buildCaseUrl(caseId)

        const {text, html} = buildApprovedEmailContent(caseUrl)

        return this.service.sendMail({
            from: '"Digital PDS" <ibmdigitalpds@gmail.com>', // sender address
            to, // list of receivers
            subject: "Family Allowance case - Approved", // subject line
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

    async sendDeniedEmail(to: string, caseId: string): Promise<boolean> {
        const caseUrl = buildCaseUrl(caseId)

        const {text, html} = buildDeniedEmailContent(caseUrl)

        return this.service.sendMail({
            from: '"Digital PDS" <ibmdigitalpds@gmail.com>', // sender address
            to, // list of receivers
            subject: "Family Allowance case - Denied", // subject line
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

const buildNeedInfoEmailContent = (caseUrl: string, needsInfo: string[]): EmailContent => {
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

const buildPendingBookingsEmailContent = (caseUrl: string): EmailContent => {
    const text = `
A Family Allowance case has been approved by the compensation office and needs to have the bookings completed.
 
Use the link below to view the details of the Family Allowance case and update the status of the case once the bookings have been completed: ${caseUrl}

Thank you,
IBM Payroll
`
    const html = `
<p>
A Family Allowance case has been approved by the compensation office and needs to have the bookings completed.
</p>
<p> 
Use the link below to view the details of the Family Allowance case and update the status of the case once the bookings have been completed: ${caseUrl}
</p>
<p>
Thank you,
IBM Payroll
</p>
`

    return {text, html}
}

const buildApprovedEmailContent = (url: string): EmailContent => {
    const text = `
Your application for a Family Allowance has been approved. We will begin the steps to apply the changes to your payroll account.

Thank you,
IBM Payroll
`
    const html = `
<p>
Your Family Allowance application has been approved. We will begin the steps to apply the changes to your payroll account.
</p>
<p>
Thank you,
IBM Payroll
</p>
`

    return {text, html}
}

const buildDeniedEmailContent = (url: string): EmailContent => {
    const text = `
Your Family Allowance application has been denied. You may view the following for more details: ${url}

If you believe the application was denied in error, please contact XXX to dispute the outcome.

Thank you,
IBM Payroll
`
    const html = `
<p>
Your Family Allowance application has been denied. You may view the following for more details: ${url}
</p>
<p>
If you believe the application was denied in error, please contact XXX to dispute the outcome.
</p>
<p>
Thank you,
IBM Payroll
</p>
`

    return {text, html}
}
