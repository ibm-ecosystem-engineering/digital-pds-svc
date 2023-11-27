
export const buildDocumentUrl = (id: string, doc: {id: string, name: string}): string => {
    return `/family-allowance/${id}/doc/${doc.id}/${doc.name}`
}
