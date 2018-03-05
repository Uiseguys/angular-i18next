/**
 * Created by S.Angel on 4/2/2017.
 */
import { Injectable } from '@angular/core';

import { Api } from "services/api/api.service";

@Injectable()
export class ProjectService {
    constructor(
        private api: Api,
    ) {

    }

    // ---------- project api ----------
    getProjectCount() {
        return this.api.get('/Projects/count');
    }

    getDetail(id) {
        return this.api.get(`/Projects/${id}`);
    }

    getProjects(page = 1, pageSize = 20) {
        const filter = {
            skip: page > 0 ? (page - 1) * pageSize : 0,
            limit: pageSize,
        };

        return this.api.get(`/Projects?filter=${JSON.stringify(filter)}`);
    }

    createProject(info) {
        return this.api.post('/Projects', info);
    }

    updateProject(id, info) {
        return this.api.patch(`/Projects/${id}`, info);
    }

    getProject(id) {
        const filter = {
        };

        return this.api.get(`/Projects/${id}?filter=${JSON.stringify(filter)}`);
    }

    deleteProject(id) {
        return this.api.delete(`/Projects/${id}`);
    }
}
