import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./NavItem.module.css";

type CommonProps = {
  icon?: ReactNode;
  trailing?: ReactNode;
  active?: boolean;
};

type AsButton = { as?: "button" } & CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;
type AsLink = { as: "a"; href?: string } & CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>;
export type NavItemProps = AsButton | AsLink;

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export const NavItem = forwardRef<HTMLButtonElement & HTMLAnchorElement, NavItemProps>(
  ({ icon, trailing, active, className, children, ...rest }, ref) => {
    const classes = cx(styles.item, active && styles.active, className);
    const content = (
      <>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.label}>{children}</span>
        {trailing && <span className={styles.trailing}>{trailing}</span>}
      </>
    );
    if ("as" in rest && rest.as === "a") {
      const { as: _as, ...anchorRest } = rest;
      return (
        <a ref={ref} className={classes} aria-current={active ? "page" : undefined} {...anchorRest}>
          {content}
        </a>
      );
    }
    const { as: _as, ...buttonRest } = rest as AsButton;
    return (
      <button ref={ref} type="button" className={classes} aria-current={active ? "page" : undefined} {...buttonRest}>
        {content}
      </button>
    );
  },
);

NavItem.displayName = "NavItem";
