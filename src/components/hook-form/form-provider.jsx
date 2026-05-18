import { FormProvider as RHFFormProvider } from 'react-hook-form';

export default function FormProvider({ children, onSubmit, methods }) {
  return (
    <RHFFormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate>
        {children}
      </form>
    </RHFFormProvider>
  );
}
