import React from 'react';
import { Dialog } from '@libs/mui';
import { FormType } from '@libs/shared-types';
import { Login, Signup } from '@libs/components';

export default function AuthModal({
  onClose,
  open,
  formType,
  setFormType,
}: {
  onClose: () => void;
  open?: boolean;
  formType: FormType;
  setFormType: React.Dispatch<React.SetStateAction<FormType>>;
}) {
  return (
    <Dialog
      transitionDuration={1000}
      onClose={onClose}
      maxWidth="xs"
      open={open}
    >
      {formType === 'signup' && <Signup setFormType={setFormType}></Signup>}
      {formType === 'login' && <Login setFormType={setFormType}></Login>}
    </Dialog>
  );
}
