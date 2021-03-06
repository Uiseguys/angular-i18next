/**
 * Created by S.Angel on 4/2/20${projectId}7.
 */
import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';

import { Api } from 'services/api/api.service';

@Injectable()
export class ProjectDetailService {
  constructor(private api: Api) {}

  getDetail(projectId = 1) {
    const filter = {
      where: {
        projectId
      },
      fields: ['language', 'namespace']
    };

    return this.api.get(`/Translations?filter=${JSON.stringify(filter)}`);
  }

  addLanguage(language, projectId = 1) {
    return this.api.post(`/Projects/${projectId}/language`, { language });
  }

  removeLanguage(language, projectId = 1) {
    return this.api.delete(
      `/Projects/${projectId}/language/${encodeURIComponent(language)}`
    );
  }

  addNamespace(namespace, projectId = 1) {
    return this.api.post(`/Projects/${projectId}/namespace`, { namespace });
  }

  removeNamespace(namespace, projectId = 1) {
    return this.api.delete(
      `/Projects/${projectId}/namespace/${encodeURIComponent(namespace)}`
    );
  }

  getVersions(projectId = 1) {
    return this.api.get(`/Projects/${projectId}/versions`);
  }

  publish(version, projectId = 1) {
    return this.api.post(`/Projects/${projectId}/publish`, { version });
  }
}
