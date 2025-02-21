import { cn } from "@/lib/utils";
import { useIsMobile } from "@/shared/lib/responsive";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (value: any) => React.ReactNode;
  mobileVisible?: boolean;
}

interface AdaptiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  onRowClick?: (row: T) => void;
}

export function AdaptiveTable<T>({
  data,
  columns,
  className,
  onRowClick
}: AdaptiveTableProps<T>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={cn("space-y-4", className)}>
        {data.map((row, idx) => (
          <Card 
            key={idx} 
            className={cn(
              "p-4",
              onRowClick && "cursor-pointer hover:bg-accent/50 transition-colors"
            )}
            onClick={() => onRowClick?.(row)}
          >
            <div className="space-y-2">
              {columns
                .filter(col => col.mobileVisible !== false)
                .map((column) => {
                  const value = row[column.accessorKey];
                  return (
                    <div
                      key={String(column.accessorKey)}
                      className="flex justify-between items-center gap-4"
                    >
                      <span className="text-sm font-medium text-muted-foreground">
                        {column.header}
                      </span>
                      <span className="text-sm text-right">
                        {column.cell ? column.cell(value) : String(value)}
                      </span>
                    </div>
                  );
              })}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.accessorKey)}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow 
              key={idx}
              className={cn(
                onRowClick && "cursor-pointer hover:bg-accent/50 transition-colors"
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => {
                const value = row[column.accessorKey];
                return (
                  <TableCell key={String(column.accessorKey)}>
                    {column.cell ? column.cell(value) : String(value)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}