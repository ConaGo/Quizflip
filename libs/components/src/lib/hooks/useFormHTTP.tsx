import { Dispatch, SetStateAction, useState, ChangeEvent } from 'react';
import Joi from 'joi';
import { DTO } from '@libs/shared-types';
import axios from 'axios';
import { GraphQLClient, gql } from 'graphql-request';
import {
  CREATE_QUESTION,
  client,
  DELETE_ALL_QUESTIONS,
  GET_ALL_CATEGORIES,
} from '@libs/data-access';
type NativeOrWeb = 'native' | 'web';
export const useFormHTTP = (
  defaultDto: DTO,
  validationObject: Joi.ObjectSchema,
  url: string,
  nativeOrWeb: NativeOrWeb = 'web'
): {
  handlers: Record<string, Handler>;
  validator: () => void;
  errors: { [x: string]: string };
  onSubmit: () => Promise<void>;
  isLoading: boolean;
  isFailed: boolean;
  isSuccess: boolean;
} => {
  const [dto, setDto] = useState<typeof defaultDto>(defaultDto);
  //automated validation after 3 secs
  /*   let didMountRef = false; //useRef(false);
  let changedRecently = false; //useRef(false);
  useEffect(() => {
    changedRecently = true;
    setTimeout(() => {
      if (didMountRef && !changedRecently) validator();
      else didMountRef = true;
      changedRecently = false;
    }, 3000);
  }, [dto]); */

  //Dynamically create Error object from formtype
  const defaultErrors: { [x: string]: string } = {};
  for (const [key] of Object.entries(dto)) {
    defaultErrors[key] = '';
  }
  const [errors, setErrors] = useState<typeof defaultErrors>(defaultErrors);
  const handlers = getHandlers(dto, setDto, nativeOrWeb);
  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validator = async () => {
    console.log('loading..');
    setIsLoading(true);
    const newErrors = { ...defaultErrors };
    const errs = validationObject.validate(dto, {
      abortEarly: false,
    }).error;
    errs?.details?.forEach(
      (e: { path: (string | number)[]; message: string }) => {
        newErrors[e.path[0]] = e.message;
      }
    );
    setErrors(newErrors);
    console.log(errs);
    const baseUrl =
      nativeOrWeb === 'native'
        ? 'http://10.0.2.2:3700/'
        : 'http://localhost:3070/';
    if (!errs) {
      try {
        const response = await fetch(baseUrl + url, {
          method: 'POST',
          body: JSON.stringify(dto),
          headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        console.log(await response.json());
        if (!response.ok) throw new Error(await response.json());
        const data = await response.json();
        console.log(data);

        /*         response = await axios({
          method: 'post',
          url: url,
          data: dto,
          baseURL: baseUrl,
          headers: {
            'Content-Type': 'application/json',
          },
        }); */

        /*         setIsSuccess(true);
        setIsLoading(false);
        await sleep(800);
        setIsSuccess(false); */
      } catch (err: any) {
        console.log(JSON.stringify(err));
        if (err.message === 'Unauthorized') {
          console.log('matched');
          setErrors({
            ...defaultErrors,
            name: 'No user with that combination found',
          });
        }
        console.log(err.message);
        const message = err?.response?.data.message;
        console.log(message);
        console.log(err);
        if (message === 'User with that name already exists')
          setErrors({ ...defaultErrors, name: message });
        if (message === 'User with that email already exists')
          setErrors({ ...defaultErrors, email: message });
        setIsLoading(false);
        setIsFailed(true);
        await sleep(800);
        setIsFailed(false);
      }
    }
    setIsLoading(false);
  };
  const onSubmit = () => validator();

  return {
    handlers,
    validator,
    errors,
    onSubmit,
    isLoading,
    isSuccess,
    isFailed,
  };
};

//Input Handlers have slightly different call signatures
//on React vs React-Native so we have to account for this
type Handler =
  | ((e: ChangeEvent<HTMLInputElement>) => void)
  | ((text: string) => void);

const getHandlers = (
  obj: DTO,
  setter: Dispatch<SetStateAction<DTO>>,
  nativeOrWeb: NativeOrWeb
): Record<string, Handler> => {
  const handlers: { [key: string]: Handler } = {};
  for (const [key] of Object.entries(obj)) {
    if (nativeOrWeb === 'web') handlers[key] = getHandler(key, obj, setter);
    else if (nativeOrWeb === 'native')
      handlers[key] = getNativeHandler(key, obj, setter);
  }
  return handlers;
};

const getHandler = (
  name: string,
  obj: DTO,
  setter: Dispatch<SetStateAction<DTO>>
): ((e: ChangeEvent<HTMLInputElement>) => void) => {
  return (e) => setter({ ...obj, [name]: e.target.value });
};
const getNativeHandler = (
  name: string,
  obj: DTO,
  setter: Dispatch<SetStateAction<DTO>>
): ((text: string) => void) => {
  return (e) => setter({ ...obj, [name]: e });
};
function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
