import axios from "axios";
import {Ak71FamilyAllowanceModel, Ak71Api} from "./ak71.api";
import {FamilyAllowanceModel} from "../../models";
import * as url from "url";
import * as console from "console";
import {response} from "express";

const ak71BaseUrl = process.env['AK_71_BASE_URL'] || 'https://ak71-mock-svc.19lft24df6mk.us-south.codeengine.appdomain.cloud'

export class Ak71Rest implements Ak71Api {
    async sendToAk71(familyAllowanceCase: FamilyAllowanceModel): Promise<Ak71FamilyAllowanceModel> {
        const url = `${ak71BaseUrl}/ak71`

        const form = new FormData();
        form.append('firstName', familyAllowanceCase.applicant.firstName);
        form.append('lastName', familyAllowanceCase.applicant.lastName);
        form.append('type', familyAllowanceCase.changeType)
        // form.append('file', file);

        return axios
            .post<Ak71FamilyAllowanceModel>(url, form)
            .then(response => {
                console.log('Response from AK71: ', {result: response.data})
                return response.data;
            })
    }

    async getAk71Case(id: string): Promise<Ak71FamilyAllowanceModel> {
        const url = `${ak71BaseUrl}/ak71/${id}`

        return axios
            .get<Ak71FamilyAllowanceModel>(url)
            .then(response => {
                console.log('Response from AK71: ', {result: response.data})
                return response.data;
            })
    }

    async getAk71Cases(ids: string[]): Promise<Ak71FamilyAllowanceModel[]> {
        return Promise.all(
            ids.map(this.getAk71Case)
        )
    }
}
