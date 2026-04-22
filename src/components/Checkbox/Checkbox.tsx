import { forwardRef, useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./Checkbox.module.css";

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: CheckboxSize;
  label?: ReactNode;
  description?: ReactNode;
  indeterminate?: boolean;
}

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ size = "md", label, description, indeterminate, className, id, disabled, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const localRef = useRef<HTMLInputElement>(null);
    const setRefs = (node: HTMLInputElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    useEffect(() => {
      if (localRef.current) localRef.current.indeterminate = Boolean(indeterminate);
    }, [indeterminate]);

    return (
      <label
        htmlFor={inputId}
        className={cx(styles.root, styles[`size-${size}`], disabled && styles.disabled, className)}
      >
        <span className={styles.control}>
          <input ref={setRefs} id={inputId} type="checkbox" className={styles.input} disabled={disabled} {...rest} />
          <span className={styles.box}>
            <svg className={styles.check} viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13.5 4.5L6.5 11.5L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className={styles.indeterminate} viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </span>
        {(label || description) && (
          <span className={styles.text}>
            {label && <span>{label}</span>}
            {description && <span className={styles.description}>{description}</span>}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
