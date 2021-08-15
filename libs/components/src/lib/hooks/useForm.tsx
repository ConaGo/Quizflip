import { Dispatch, SetStateAction, useState, ChangeEvent } from 'react';
import Joi from 'joi';
import {
  DTO,
  FormType,
  loginFormData,
  signupFormData,
  recoveryFormData,
} from '@libs/shared-types';
import axios from 'axios';
type NativeOrWeb = 'native' | 'web';
const useForm = (
  defaultDto: DTO,
  validationObject: Joi.ObjectSchema,
  url: string,
  nativeOrWeb: NativeOrWeb
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
    /*     const formData;

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
    } */
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
        ? 'http://10.0.2.2:3700'
        : 'http://localhost:3070';
    if (!errs) {
      try {
        const response = await axios({
          method: 'post',
          url: url,
          data: dto,
          baseURL: baseUrl,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setIsSuccess(true);
        setIsLoading(false);
        await sleep(800);
        setIsSuccess(false);
      } catch (err) {
        const message = err.response?.data.message;
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

export default useForm;

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
