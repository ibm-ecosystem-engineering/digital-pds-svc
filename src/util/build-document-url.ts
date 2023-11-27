
const host = process.env.DOC_URL_BASE || 'https://digital-pds-ui.19lft24df6mk.us-south.codeengine.appdomain.cloud/api'

export const buildDocumentUrl = (id: string, doc: {id: string, name: string}): string => {
    return `${host}/family-allowance/${id}/doc/${doc.id}/${doc.name}`
}
