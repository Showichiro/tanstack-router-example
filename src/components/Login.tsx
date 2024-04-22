import { Heading, Input } from "@kuma-ui/core";
import { useForm } from "@tanstack/react-form";
import type { ChangeEvent, FC } from "react";
import { useAuth } from "../global/auth";

export const Login: FC = () => {
  const { login } = useAuth();

  const form = useForm({
    defaultValues: {
      username: "",
    },
    onSubmit: (values) => {
      console.log(values);
      login(values.value.username);
    },
  });

  return (
    <div>
      <Heading as="h1" color="#333">
        Login
      </Heading>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "name is required"
                : value.length < 3
                  ? "name must be at least 3 characters"
                  : undefined,
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) => {
              return (
                value.includes("error") && 'No "error" allowed in first name'
              );
            },
          }}
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <>
                <label htmlFor={field.name}>Your Name:</label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    field.handleChange(e.target.value)
                  }
                  placeholder="Enter your name"
                />
                <p>
                  {field.state.meta.touchedErrors && (
                    <em>{field.state.meta.touchedErrors}</em>
                  )}
                  {field.state.meta.isValidating ? "Validating..." : null}
                </p>
              </>
            );
          }}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "...Loading" : "Submit"}
            </button>
          )}
        />
      </form>
    </div>
  );
};
