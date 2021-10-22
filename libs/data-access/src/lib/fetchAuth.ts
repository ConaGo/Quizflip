import { DTO } from '@libs/shared-types';

export const fetchAuth = async (baseUrl: string, action: string, dto: DTO) =>
  fetch(baseUrl + 'auth/' + action, {
    method: action === 'refresh' ? 'GET' : 'POST',
    body: action === 'refresh' ? null : JSON.stringify(dto),
    credentials: 'include',
    mode: 'cors',
    redirect: 'follow',
    headers: {
      'Content-Type': 'application/json',
    },
  });
