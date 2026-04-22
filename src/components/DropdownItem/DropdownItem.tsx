import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./DropdownItem.module.css";

export interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  meta?: ReactNode;
  selected?: boolean;
}

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ icon, meta, selected, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      className={cx(styles.item, selected && styles.selected, className)}
      {...rest}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>{children}</span>
      {meta && <span className={styles.meta}>{meta}</span>}
      {selected && (
        <svg className={styles.check} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M13.5 4.5L6.5 11.5L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  ),
);

DropdownItem.displayName = "DropdownItem";
