import { forwardRef, type HTMLAttributes, type ThHTMLAttributes, type TdHTMLAttributes, type ReactNode } from "react";
import styles from "./Table.module.css";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, children, ...rest }, ref) => (
    <table ref={ref} className={cx(styles.table, className)} {...rest}>{children}</table>
  ),
);
Table.displayName = "Table";

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...rest }, ref) => <tr ref={ref} className={cx(styles.tr, className)} {...rest} />,
);
TableRow.displayName = "TableRow";

export type Align = "left" | "right" | "center";
export type SortDirection = "asc" | "desc" | false;

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: Align;
  sortable?: boolean;
  sort?: SortDirection;
  onSort?: () => void;
}

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  ({ align = "left", sortable, sort, onSort, className, children, ...rest }, ref) => (
    <th
      ref={ref}
      className={cx(
        styles.th,
        align === "right" && styles.alignRight,
        align === "center" && styles.alignCenter,
        sortable && styles.sortable,
        sort === "asc" && styles.sortAsc,
        sort === "desc" && styles.sortDesc,
        className,
      )}
      onClick={sortable ? onSort : undefined}
      aria-sort={sort === "asc" ? "ascending" : sort === "desc" ? "descending" : undefined}
      {...rest}
    >
      {children}
      {sortable && (
        <span className={styles.sortIndicator} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 3L9.5 7.5H2.5L6 3Z" fill="currentColor" />
          </svg>
        </span>
      )}
    </th>
  ),
);
TableHeaderCell.displayName = "TableHeaderCell";

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: Align;
  numeric?: boolean;
  value?: "positive" | "negative" | "neutral";
  children?: ReactNode;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ align, numeric, value, className, children, ...rest }, ref) => (
    <td
      ref={ref}
      className={cx(
        styles.td,
        (align === "right" || numeric) && styles.alignRight,
        align === "center" && styles.alignCenter,
        numeric && styles.numeric,
        value === "positive" && styles.valuePositive,
        value === "negative" && styles.valueNegative,
        className,
      )}
      {...rest}
    >
      {children}
    </td>
  ),
);
TableCell.displayName = "TableCell";
