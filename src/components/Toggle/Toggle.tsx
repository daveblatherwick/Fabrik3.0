import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./Toggle.module.css";

export type ToggleSize = "sm" | "md" | "lg";

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: ToggleSize;
  label?: ReactNode;
}

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ size = "md", label, className, id, disabled, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    return (
      <label
        htmlFor={inputId}
        className={cx(styles.root, styles[`size-${size}`], disabled && styles.disabled, className)}
      >
        <span className={styles.wrapper}>
          <input ref={ref} id={inputId} type="checkbox" className={styles.input} disabled={disabled} {...rest} />
          <span className={styles.track}>
            <span className={styles.thumb} />
          </span>
        </span>
        {label && <span>{label}</span>}
      </label>
    );
  },
);

Toggle.displayName = "Toggle";
