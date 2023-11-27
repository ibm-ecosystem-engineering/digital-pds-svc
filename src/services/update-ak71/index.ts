import {UpdateAk71Api} from "./update-ak71.api";
import {UpdateAk71Rest} from "./update-ak71.rest";

export * from './update-ak71.api'

let _instance: UpdateAk71Api
export const updateAk71Api = (): UpdateAk71Api => {
    if (_instance) {
        return _instance
    }

    return _instance = new UpdateAk71Rest()
}
