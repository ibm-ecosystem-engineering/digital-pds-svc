
export const UI_HOST = process.env['UI_HOST'] || 'https://digital-pds-ui.19lft24df6mk.us-south.codeengine.appdomain.cloud'

export const BASE_DOC_URL = `${UI_HOST}/api`

export const buildDocumentUrl = (id: string, doc: {id: string, name: string}): string => {
    return `${BASE_DOC_URL}/family-allowance/${id}/doc/${doc.id}/${doc.name}`
}

export const buildCaseUrl = (id: string): string => {
    return `${UI_HOST}/${id}`
}
