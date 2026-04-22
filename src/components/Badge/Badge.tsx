import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Badge.module.css";

export type BadgeColor = "gray" | "brand" | "error" | "warning" | "success" | "buy" | "sell";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  size?: BadgeSize;
  dot?: boolean;
}

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ color = "gray", size = "md", dot, className, children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cx(styles.badge, styles[`size-${size}`], styles[`color-${color}`], className)}
      {...rest}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  ),
);

Badge.displayName = "Badge";
