import { Dispatch, SetStateAction, useState, ChangeEvent } from 'react';
import Joi from 'joi';
import { ApolloError, DocumentNode, useMutation } from '@apollo/client';

export type ErrorObject<T> = {
  [K in keyof T]: string;
};
export type HandlerObject<T> = {
  [K in keyof T]: Handler;
};

export function useForm<T>(
  defaultDto: T,
  validationObject: Joi.ObjectSchema<T>,
  mutation: DocumentNode
): {
  dto: T;
  handlers: HandlerObject<T>;
  validate: () => Promise<boolean>;
  errors: ErrorObject<T>;
  onSubmit: () => Promise<void>;
  loading: boolean;
  error: ApolloError | undefined;
  data: unknown;
} {
  //Initialize state object
  const [dto, setDto] = useState<T>(defaultDto);
  console.log(dto);
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

  const [mutate, { data, loading, error }] = useMutation(mutation);
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
        mutate({ variables: dto });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return {
    dto,
    handlers,
    validate,
    errors,
    onSubmit,
    loading,
    error,
    data,
  };
}

//Input Handlers have slightly different call signatures
//on React vs React-Native so we have to account for this
/* export type WebHandler = (e: ChangeEvent<HTMLInputElement>) => void;
export type NativeHandler = (text: string) => void;
export type StringArrayHandler = (array: string[]) => void;
export type Handler = WebHandler | NativeHandler | StringArrayHandler; */
export type Handler = (value: unknown) => void;
function getHandlers<T>(
  obj: T,
  setter: Dispatch<SetStateAction<T>>
): HandlerObject<T> {
  const handlers: { [key: string]: Handler } = {};
  for (const [key] of Object.entries(obj)) {
    handlers[key] = getHandler(key, obj, setter);
  }
  return handlers as HandlerObject<T>;
}

function getHandler<T>(
  name: string,
  obj: T,
  setter: Dispatch<SetStateAction<T>>
): (e: unknown) => void {
  return (e) => setter({ ...obj, [name]: e });
}
