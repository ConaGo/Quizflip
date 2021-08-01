import React, { Dispatch, SetStateAction, useState, ChangeEvent } from 'react';

import useAxios from 'axios-hooks';
import {
  DTO,
  FormType,
  loginFormData,
  signupFormData,
  recoveryFormData,
} from '@libs/shared-types';

export const nativeHelper = (text: string) => {
  return { e: { target: { value: text } } };
};
type NativeOrWeb = 'native' | 'web';
const useForm = (
  defaultDto: DTO,
  formType: FormType,
  nativeOrWeb: NativeOrWeb
): {
  handlers: Record<string, Handler>;
  validator: (string: string) => void;
  errors: { [x: string]: string };
  onSubmit: () => void;
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

  const [{ data, loading, error }, refetch] = useAxios(
    {
      method: 'post',
      url: '/auth/' + formType,
      data: dto,
      baseURL: 'http://localhost:3070',
    },
    { manual: true }
  );

  const handlers = getHandlers(dto, setDto, nativeOrWeb);
  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const validator = async () => {
    console.log('loading..');
    setIsLoading(true);
    const newErrors = { ...defaultErrors };
    let formData;

    switch (formType) {
      case 'login':
        formData = loginFormData;
        break;
      case 'signup':
        formData = signupFormData;
        break;
      case 'recovery':
        formData = recoveryFormData;
        break;
      default:
        formData = loginFormData;
    }

    const es = formData.validate(dto, {
      abortEarly: false,
    }).error;
    es?.details?.forEach(
      (e: { path: (string | number)[]; message: string }) => {
        newErrors[e.path[0]] = e.message;
      }
    );
    setErrors(newErrors);
    console.log(formType);
    if (!es) {
      try {
        await refetch();
        setIsSuccess(true);
        setIsLoading(false);
        await sleep(800);
        setIsSuccess(false);
      } catch (err) {
        console.log(err.response);
        const message = err.response?.data.message;
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
    console.log('done.');
    console.log(data);
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

export default useForm;

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
