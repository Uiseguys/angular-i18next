/**
 * Created by S.Angel on 4/2/2017.
 */
import { Injectable } from '@angular/core';
import { Api } from 'services/api/api.service';

@Injectable()
export class TranslationService {
  constructor(private api: Api) {}

  importKeys(projectId, namespace, file) {
    const headers = new Headers({ enctype: 'multipart/form-data' });
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.api.post(
      `/Projects/${projectId}/${namespace}/import`,
      formData,
      {
        headers
      }
    );
  }

  getDetail(language, namespace, projectId = 1) {
    const filter = {
      include: ['project'],
      where: {
        projectId,
        language,
        namespace
      }
    };

    return this.api.get(`/Translations?filter=${JSON.stringify(filter)}`);
  }

  getLanguages(namespace, projectId = 1) {
    const filter = {
      fields: { language: true },
      where: {
        projectId,
        namespace
      }
    };

    return this.api.get(`/Translations?filter=${JSON.stringify(filter)}`);
  }

  addEntry(translationId, detail) {
    return this.api.post(`/Translations/${translationId}/entry`, detail);
  }

  updateEntry(translationId, detail) {
    return this.api.patch(`/Translations/${translationId}/entry`, detail);
  }

  deleteEntry(translationId, key) {
    return this.api.delete(
      `/Translations/${translationId}/entry/${encodeURIComponent(key)}`
    );
  }

  updateKey(translationId, detail) {
    return this.api.patch(`/Translations/${translationId}/key`, detail);
  }
}
