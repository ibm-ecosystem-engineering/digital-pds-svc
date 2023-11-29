
export const apiTitle: string = 'Digital PDS API';
export const skillIdPrefix: string = apiTitle.replace(/ /g, '-')
export const apiVersion = process.env['npm_package_version'] || '0.0.0';

export const operationIdAddCase = 'add-family-allowance-case'
export const operationIdListCases = 'list-family-allowance-cases';
export const operationIdGetCase = 'get-family-allowance-case';
export const operationIdGetCaseSummary = 'get-family-allowance-case-summary';
export const operationIdGetCaseDocuments = 'get-family-allowance-case-docs';
export const operationIdGetCaseHistory = 'get-family-allowance-case-history';
export const operationIdUpdateCase = 'update-family-allowance-case';
export const operationIdNeedsInfo = 'family-allowance-case-needs-info';
export const operationIdSendToCompensationOffice = 'send-family-allowance-case-to-compensation';
export const operationIdSendToBookings = 'send-family-allowance-case-to-compensation';
export const operationIdCloseCase = 'close-family-allowance-case';
export const operationIdAddDocument = 'add-family-allowance-case-document';
export const operationIdDownloadDocument = 'download-family-allowance-case-document';
export const operationIdSyncCases = 'sync-family-allowance-cases';

export const buildSkillId = (operationId: string): string => {
    return `${skillIdPrefix}__${apiVersion}__${operationId}`
}
