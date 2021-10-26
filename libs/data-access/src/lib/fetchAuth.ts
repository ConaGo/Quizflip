import { DTO } from '@libs/shared-types';

export const fetchAuth = async (baseUrl: string, action: string, dto: DTO) => {
  return fetch(baseUrl + 'auth/' + action, {
    method: action === 'refresh' ? 'GET' : 'POST',
    body: action === 'refresh' ? null : JSON.stringify(dto),
    credentials: 'include',
    mode: 'cors',
    redirect: 'follow',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => console.log(response.json()))

    .catch((err) => console.log(err));
};
/* export const _promiseToObservable = (promiseFunc) =>
  new Observable((subscriber) => {
    promiseFunc.then(
      (value) => {
        console.log('HE');
        console.log(value);
        if (subscriber.closed) return;
        subscriber.next(value);
        subscriber.complete();
      },
      (err) => {
        console.log(err);
        subscriber.error(err);
      }
    );
    return subscriber; // this line can removed, as per next comment
  });
 */
