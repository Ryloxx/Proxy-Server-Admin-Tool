import { FormControl, Input, Button, VStack } from 'native-base';
import React, { FC, useState } from 'react';

type Field = {
  type: 'text' | 'password' | 'email';
  validator?: {
    required?:
      | {
          errorMessage: string;
        }
      | true;
    pattern?: {
      regex: RegExp;
      errorMessage: string;
    };
  };
  label: string;
  name: string;
};

type FormState = {
  hasError: boolean;
  fieldsState: Record<
    string,
    {
      error: string;
      value: string;
    }
  >;
};

const Form: FC<{
  fields: Field[];
  onDataSubmit: (data: Record<string, string>) => void;
  buttonLabel?: string;
  loading?: boolean;
}> = ({ fields, onDataSubmit, buttonLabel = 'Submit', loading }) => {
  function getInitialState() {
    const result: FormState = { fieldsState: {}, hasError: false };
    fields.forEach((field) => {
      result.fieldsState[field.name] = {
        error: '',
        value: '',
      };
    });
    return result;
  }

  const [formState, setFormState] = useState<FormState>({
    ...getInitialState(),
  });

  function parseFields(fieldState: Record<string, { value: string }>) {
    const result: Record<string, string> = {};
    Object.entries(fieldState).forEach(([name, state]) => {
      result[name] = state.value;
    });
    return result;
  }
  function validate() {
    formState.hasError = false;
    fields.forEach((fieldData) => {
      const { validator } = fieldData;
      let hasError = false;
      if (!validator) return;
      const { pattern, required } = validator;
      const field = formState.fieldsState[fieldData.name];
      if (pattern && !pattern.regex.test(field.value || '')) {
        field.error = pattern.errorMessage;
        hasError = true;
      }
      if (!field.value?.trim() && required) {
        field.error =
          typeof required === 'object' ? required.errorMessage : 'Required';
        hasError = true;
      }
      if (hasError) {
        formState.hasError = true;
      } else {
        field.error = '';
      }
    });
    setFormState({ ...formState });
    if (!formState.hasError) {
      onDataSubmit(parseFields(formState.fieldsState));
    }
  }
  return (
    <VStack space={3} pt={2}>
      {fields.map((field) => {
        const { error, value } = formState.fieldsState[field.name];
        return (
          <FormControl
            key={field.name}
            isInvalid={!!error}
            isRequired={!!field?.validator?.required}
            isDisabled={loading}
          >
            <Input
              variant="rounded"
              type={field.type}
              defaultValue={value}
              placeholder={field.label}
              onChangeText={(text) => {
                formState.fieldsState[field.name].value = text;
                setFormState({ ...formState });
              }}
            />
            <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
          </FormControl>
        );
      })}
      <Button
        isLoading={loading}
        onPress={() => {
          validate();
        }}
      >
        {buttonLabel}
      </Button>
    </VStack>
  );
};
export default Form;
