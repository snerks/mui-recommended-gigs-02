import { TextField, TextFieldProps } from "@material-ui/core";
import {
  Autocomplete,
  // AutocompleteInputChangeReason,
  AutocompleteProps,
  createFilterOptions,
  FilterOptionsState,
} from "@material-ui/lab";
import { FieldProps } from "formik";
import { fieldToTextField } from "formik-material-ui";
import React from "react";

const AnyAutocomplete = Autocomplete as any;

export interface FormikAutocompleteProps<
  V extends any = any,
  FormValues extends any = any
  > extends FieldProps<V, FormValues>, AutocompleteProps<V> {
  textFieldProps: TextFieldProps;
}

// const noOp = () => { };

export interface StringOptionType {
  inputValue?: string;
  text: string;
}

const filter = createFilterOptions<StringOptionType>();

const FormikAutocomplete = <V extends any = any, FormValues extends any = any>({
  textFieldProps,
  ...props
}: FormikAutocompleteProps<V, FormValues>) => {
  // const [value, setValue] = React.useState<StringOptionType | null>(null);

  const {
    // form: { setTouched, setFieldValue, touched },
    form: { setFieldValue },
  } = props;
  const { error, helperText, ...field } = fieldToTextField(props as any);
  const { name } = field;
  // const onInputChangeDefault = props.onInputChange ?? noOp;
  // const onInputChange = !props.freeSolo
  //   ? props.onInputChange
  //   : (
  //       event: React.ChangeEvent<{}>,
  //       value: string,
  //       reason: AutocompleteInputChangeReason
  //     ) => {
  //       setFieldValue(name!, value);
  //       onInputChangeDefault(event, value, reason);
  //     };

  return (
    <AnyAutocomplete
      {...props}
      {...field}
      // onChange={(_: any, value: any, reason: string) =>
      //   setFieldValue(name!, value)
      // }
      onChange={(event: any, newValue: StringOptionType | null) => {
        // Create a new value from the user input
        if (newValue && newValue.inputValue) {
          setFieldValue(name!, newValue.inputValue);
          return;
        }

        setFieldValue(name!, newValue ? newValue.text || "" : "");
      }}
      filterOptions={(
        options: StringOptionType[],
        state: FilterOptionsState<StringOptionType>
      ) => {
        const filtered = filter(options, state) as StringOptionType[];

        // Suggest the creation of a new value
        if (state.inputValue !== "") {
          filtered.push({
            inputValue: state.inputValue,
            text: `Add "${state.inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      getOptionLabel={(option: StringOptionType) => {
        // console.log("getOptionLabel", option);
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          // console.log("getOptionLabel : returning", option);
          return option;
        }
        // Add "xxx" option created dynamically
        // if (option.inputValue) {
        //   console.log("getOptionLabel : returning", option.inputValue);
        //   return option.text;
        // }
        // Regular option
        // console.log("getOptionLabel : returning", option.text);
        return option.text || "";
      }}
      // onInputChange={onInputChange}
      // onBlur={() => setTouched({ ...touched, [name!]: true })}
      renderInput={(props: any) => (
        <TextField
          {...props}
          {...textFieldProps}
          helperText={helperText}
          error={error}
        />
      )}
    />
  );
};

export default FormikAutocomplete;
