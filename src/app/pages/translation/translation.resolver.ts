import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { TranslationService } from "./translation.service";

@Injectable()
export class TranslationResolver implements Resolve<any> {

    constructor(
        private api: TranslationService,
        private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        const projectId = route.params['projectId'];
        const language = route.params['language'] || 'en';
        const namespace = route.params['namespace'] || 'default';

        return new Promise((resolve, reject) => {
            this.api.getDetail(language, namespace, projectId).subscribe(res => {
                if (res.length) {
                    resolve(res[0]);
                } else {
                    reject('Not found');
                }
            });
        });
    }
}