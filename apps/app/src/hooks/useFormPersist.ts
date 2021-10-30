import { Dispatch, SetStateAction, useState } from 'react';
import { ObjectSchema } from 'joi';
import { useMutation } from 'react-query';
import axios from 'axios';
//import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { useLocalStorage } from '../hooks/useLocalStorage';

type TData = unknown;
type TError = unknown;

export type ErrorObject<T> = {
  [K in keyof T]: string;
};
export type HandlerObject<T> = {
  [K in keyof T]: Handler;
};
export type Handler = (value: unknown) => void;

export interface IUseFormPersist<T> {
  defaultDto: T;
  validationObject: ObjectSchema<T>;
  mutation: string;
  storageKey: string;
  onError?: (data: TData) => void;
  onSuccess?: (error: TError) => void;
}

export const useFormPersist = <T>({
  defaultDto,
  validationObject,
  mutation,
  storageKey,
  onError,
  onSuccess,
}: IUseFormPersist<T>): {
  dto: T;
  handlers: HandlerObject<T>;
  validate: () => Promise<boolean>;
  errors: ErrorObject<T>;
  onSubmit: () => Promise<void>;
  loading: boolean;
  error: any;
  data: unknown;
} => {
  //Initialize state object
  const [dto, setDto] = useLocalStorage<T>(storageKey, defaultDto);

  //Dynamically create Error object from formtype
  const defaultErrors: { [x: string]: string } = {};
  for (const [key] of Object.entries(dto)) {
    defaultErrors[key] = '';
  }
  const [errors, setErrors] = useState<ErrorObject<T>>(
    defaultErrors as ErrorObject<T>
  );

  //Get handlers for all fields
  const handlers = getHandlers(dto, setDto);

  const { mutate, data, isLoading, error } = useMutation(
    (dto: T) =>
      axios.post('/graphql', {
        query: mutation,
        variables: { input: dto },
      }),
    {
      onError: onError,
      onSuccess: onSuccess,
    }
  );

  const validate: () => Promise<boolean> = async () => {
    const newErrors = { ...defaultErrors };

    //validate input
    const errs = validationObject.validate(dto, {
      abortEarly: false,
    }).error;

    //extract errors
    errs?.details?.forEach(
      (e: { path: (string | number)[]; message: string }) => {
        newErrors[e.path[0]] = e.message;
      }
    );
    setErrors(newErrors as ErrorObject<T>);
    console.log(errs);
    return !errs;
  };

  const onSubmit = async () => {
    if (await validate()) {
      try {
        mutate(dto);
      } catch (err) {
        console.log(err);
      }
    }
  };

  function getHandler<T>(
    name: string,
    obj: T,
    setter: typeof setDto
  ): (e: unknown) => void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (e) => setter({ ...obj, [name]: e });
  }

  function getHandlers<T>(obj: T, setter: typeof setDto): HandlerObject<T> {
    const handlers: { [key: string]: Handler } = {};
    for (const [key] of Object.entries(obj)) {
      handlers[key] = getHandler(key, obj, setter);
    }
    return handlers as HandlerObject<T>;
  }

  return {
    dto,
    handlers,
    validate,
    errors,
    onSubmit,
    loading: isLoading,
    error,
    data,
  };
};
