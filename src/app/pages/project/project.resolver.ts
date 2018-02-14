import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { ProjectService } from "./project.service";

@Injectable()
export class ProjectResolver implements Resolve<any> {

    constructor(
        private api: ProjectService,
        private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        let id = route.params['projectId'];

        return new Promise((resolve, reject) => {
            this.api.getDetail(id).subscribe(res => {
                resolve(res);
            });
        });
    }
}