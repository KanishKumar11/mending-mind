"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Settings,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

export function DataTable({ columns, data }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState(() => {
    // Try to load saved preferences from localStorage
    if (typeof window !== "undefined") {
      const savedVisibility = localStorage.getItem("tableColumnVisibility");
      if (savedVisibility) {
        try {
          return JSON.parse(savedVisibility);
        } catch (e) {
          console.error("Error parsing saved column visibility:", e);
        }
      }
    }

    // Default visibility settings if nothing is saved
    return {
      extraversion: false,
      agreeableness: false,
      conscientiousness: false,
      neuroticism: false,
      openness: false,
      rational: false,
      intuitive: false,
      empathy: false,
      emotional: false,
      decision: false,
    };
  });
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: (visibility) => {
      setColumnVisibility(visibility);

      // Save to localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "tableColumnVisibility",
          JSON.stringify(visibility)
        );
      }
    },
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Enhanced function to export comprehensive data as CSV
  const exportToCSV = () => {
    try {
      // Define all possible columns for comprehensive export
      const allPossibleColumns = [
        { key: "name", header: "Name" },
        { key: "age", header: "Age" },
        { key: "gender", header: "Gender" },
        { key: "email", header: "Email" },
        { key: "contact", header: "Contact" },
        { key: "attemptNumber", header: "Attempt Number" },
        { key: "totalAttempts", header: "Total Attempts" },
        { key: "attemptDate", header: "Attempt Date" },
        { key: "extraversion", header: "Extraversion" },
        { key: "agreeableness", header: "Agreeableness" },
        { key: "conscientiousness", header: "Conscientiousness" },
        { key: "neuroticism", header: "Neuroticism" },
        { key: "openness", header: "Openness" },
        { key: "stress", header: "Stress" },
        { key: "rational", header: "Rational" },
        { key: "intuitive", header: "Intuitive" },
        { key: "resilience", header: "Resilience" },
        { key: "taxpayerJudgement", header: "Taxpayer Judgement" },
        { key: "empathy", header: "CBIC Empathy" },
        { key: "emotional", header: "CBIC Emotional" },
        { key: "decision", header: "CBIC Decision" },
        { key: "createdAt", header: "User Created Date" },
      ];

      // Note: We export all columns regardless of visibility for comprehensive data

      // Helper function to escape CSV values properly
      const escapeCSV = (value) => {
        if (value === null || value === undefined) {
          return "";
        }

        // Convert to string if not already
        const stringValue = String(value);

        // If value contains quotes, commas, or newlines, escape quotes and wrap in quotes
        if (
          stringValue.includes('"') ||
          stringValue.includes(",") ||
          stringValue.includes("\n")
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      };

      // Create header row using comprehensive column list
      const headers = allPossibleColumns
        .map((column) => escapeCSV(column.header))
        .join(",");

      // Create data rows using comprehensive column extraction
      const rows = table
        .getFilteredRowModel()
        .rows.map((row) => {
          return allPossibleColumns
            .map((column) => {
              let cellValue;

              try {
                const rowData = row.original;

                // Extract data based on column key
                switch (column.key) {
                  case "name":
                  case "age":
                  case "gender":
                  case "email":
                  case "contact":
                  case "attemptNumber":
                  case "totalAttempts":
                    cellValue = rowData[column.key];
                    break;
                  case "attemptDate":
                    cellValue = rowData.attemptDate
                      ? format(
                          new Date(rowData.attemptDate),
                          "yyyy-MM-dd HH:mm:ss"
                        )
                      : "";
                    break;
                  case "createdAt":
                    cellValue = rowData.createdAt
                      ? format(
                          new Date(rowData.createdAt),
                          "yyyy-MM-dd HH:mm:ss"
                        )
                      : "";
                    break;
                  case "extraversion":
                  case "agreeableness":
                  case "conscientiousness":
                  case "neuroticism":
                  case "openness":
                    cellValue =
                      rowData.currentAttempt?.personality?.[column.key];
                    break;
                  case "stress":
                  case "resilience":
                  case "taxpayerJudgement":
                    cellValue = rowData.currentAttempt?.[column.key];
                    break;
                  case "rational":
                  case "intuitive":
                    cellValue =
                      rowData.currentAttempt?.decisionStyle?.[column.key];
                    break;
                  case "empathy":
                  case "emotional":
                  case "decision":
                    cellValue = rowData.currentAttempt?.cbic?.[column.key];
                    break;
                  default:
                    cellValue = "";
                }

                // Handle undefined/null values
                if (cellValue === undefined || cellValue === null) {
                  cellValue = "";
                }
              } catch (error) {
                console.error(
                  `Error getting value for column ${column.key}:`,
                  error
                );
                cellValue = "";
              }

              return escapeCSV(cellValue);
            })
            .join(",");
        })
        .join("\n");

      // Combine headers and rows
      const csv = `${headers}\n${rows}`;

      // Create download link
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `user_quiz_data_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up to avoid memory leaks
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("There was an error exporting the CSV file. Please try again.");
    }
  };

  return (
    <div className="space-y-4 p-6 bg-[#ffffff] rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter by name..."
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="ml-auto bg-white hover:bg-[#F0C93B]/10"
            onClick={exportToCSV}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto bg-white hover:bg-[#F0C93B]/10"
              >
                <Settings className="mr-2 h-4 w-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {table.getAllColumns().map((column) => {
                // Skip columns that shouldn't be toggleable
                if (column.id === "name") return null;

                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => {
                      // This will trigger onColumnVisibilityChange which saves to localStorage
                      column.toggleVisibility(!!value);
                    }}
                  >
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border overflow-x-auto bg-white">
        <Table>
          <TableHeader className="bg-[#B4E0E0]/20">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-black"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#F8F8F0]"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} total rows
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px] bg-white">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex bg-white hover:bg-[#F0C93B]/10"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 bg-white hover:bg-[#F0C93B]/10"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 bg-white hover:bg-[#F0C93B]/10"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex bg-white hover:bg-[#F0C93B]/10"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
