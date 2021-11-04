import { Dispatch, SetStateAction, useState, ChangeEvent } from 'react';
import Joi from 'joi';
import { DTO } from '@libs/shared-types';
import { useAuth } from './useAuth';
import axios from './axios';

type Handler = (e: ChangeEvent<HTMLInputElement>) => void;
const getHandler = (
  name: string,
  obj: DTO,
  setter: Dispatch<SetStateAction<DTO>>
): ((e: ChangeEvent<HTMLInputElement>) => void) => {
  return (e) => setter({ ...obj, [name]: e.target.value });
};
const getHandlers = (
  obj: DTO,
  setter: Dispatch<SetStateAction<DTO>>
): Record<string, Handler> => {
  const handlers: { [key: string]: Handler } = {};
  for (const [key] of Object.entries(obj)) {
    handlers[key] = getHandler(key, obj, setter);
  }
  return handlers;
};
export const useFormAuth = (
  defaultDto: DTO,
  validationObject: Joi.ObjectSchema,
  action: 'login' | 'signup'
): {
  handlers: Record<string, Handler>;
  validator: () => void;
  errors: { [x: string]: string };
  onSubmit: () => Promise<void>;
  isLoading: boolean;
  isFailed: boolean;
  isSuccess: boolean;
} => {
  const { login } = useAuth();
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
  const handlers = getHandlers(dto, setDto);
  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validator = () => {
    const newErrors = { ...defaultErrors };
    const errs = validationObject?.validate(dto, {
      abortEarly: false,
    }).error;
    errs?.details?.forEach(
      (e: { path: (string | number)[]; message: string }) => {
        newErrors[e.path[0]] = e.message;
      }
    );
    setErrors(newErrors);
    return !errs;
  };
  const onSubmit = async () => {
    if (validator()) {
      setIsLoading(true);
      try {
        const response = await axios.post('auth/' + action, dto);
        if (response.status === 200) {
          setIsSuccess(true);
          setIsLoading(false);

          await sleep(300);
          login(response.data);
          setIsSuccess(false);
        }
        throw new Error(response.data?.message);
      } catch (err: any) {
        console.log(err.response);
        const message = err.response?.data?.message;
        console.log(message);
        if (message === 'Unauthorized') {
          setErrors({
            ...defaultErrors,
            nameOrEmail: 'No user with that combination found',
            password: 'No user with that combination found',
          });
        }
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

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
