import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./Tab.module.css";

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  badge?: ReactNode;
}

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ active, badge, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={active}
      className={cx(styles.tab, active && styles.active, className)}
      {...rest}
    >
      {children}
      {badge != null && <span className={styles.badge}>{badge}</span>}
    </button>
  ),
);
Tab.displayName = "Tab";

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  items: Array<{ value: string; label: ReactNode; badge?: ReactNode; disabled?: boolean }>;
}

export function Tabs({ defaultValue, value: controlled, onValueChange, items }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value);
  const value = controlled ?? internal;
  const setValue = (v: string) => {
    if (controlled === undefined) setInternal(v);
    onValueChange?.(v);
  };
  return (
    <div role="tablist" className={styles.list}>
      {items.map((item) => (
        <Tab
          key={item.value}
          active={value === item.value}
          disabled={item.disabled}
          badge={item.badge}
          onClick={() => setValue(item.value)}
        >
          {item.label}
        </Tab>
      ))}
    </div>
  );
}
