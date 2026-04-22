import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./InputField.module.css";

export interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, hint, error, leadingIcon, trailingIcon, className, id, onFocus, onBlur, disabled, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [focused, setFocused] = useState(false);
    const invalid = Boolean(error);

    return (
      <div className={cx(styles.root, className)}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div
          className={cx(
            styles.field,
            focused && styles.focused,
            invalid && styles.invalid,
            disabled && styles.disabled,
          )}
        >
          {leadingIcon && <span className={styles.adornment}>{leadingIcon}</span>}
          <input
            id={inputId}
            ref={ref}
            className={styles.input}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-describedby={hint || error ? `${inputId}-hint` : undefined}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            {...rest}
          />
          {trailingIcon && <span className={styles.adornment}>{trailingIcon}</span>}
        </div>
        {(error || hint) && (
          <span id={`${inputId}-hint`} className={cx(styles.hint, invalid && styles.error)}>
            {error ?? hint}
          </span>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";
