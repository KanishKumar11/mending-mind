"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

export const columns = [
  {
    accessorKey: "attemptNumber",
    header: "Attempt #",
    cell: ({ row }) => {
      const attemptNumber = row.original.attemptNumber;
      const totalAttempts = row.original.totalAttempts;

      if (attemptNumber === 0) {
        return <div className="text-center text-gray-500">No attempts</div>;
      }

      return (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                attemptNumber === 1
                  ? "bg-blue-100 text-blue-800"
                  : attemptNumber === 2
                  ? "bg-green-100 text-green-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              Attempt {attemptNumber}
            </span>
          </div>
          <span className="text-gray-500 text-xs mt-1 block">
            {totalAttempts} total
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name");
      const attemptNumber = row.original.attemptNumber;
      const totalAttempts = row.original.totalAttempts;

      return (
        <div>
          <div className="font-medium">{name}</div>
          {totalAttempts > 1 && (
            <div className="text-xs text-gray-500">
              {attemptNumber === 1
                ? "First attempt"
                : attemptNumber === 2
                ? "Second attempt"
                : `Attempt ${attemptNumber}`}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    accessorKey: "attemptDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Attempt Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("attemptDate"));
      return <div>{format(date, "PPP")}</div>;
    },
  },
  {
    id: "extraversion",
    header: "Extraversion",
    accessorFn: (row) => row.currentAttempt?.personality?.extraversion,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="text-center">{value !== undefined ? value : "N/A"}</div>
      );
    },
  },
  {
    id: "agreeableness",
    header: "Agreeableness",
    accessorFn: (row) => row.currentAttempt?.personality?.agreeableness,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="text-center">{value !== undefined ? value : "N/A"}</div>
      );
    },
  },
  {
    id: "conscientiousness",
    header: "Conscientiousness",
    accessorFn: (row) => row.currentAttempt?.personality?.conscientiousness,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="text-center">{value !== undefined ? value : "N/A"}</div>
      );
    },
  },
  {
    id: "neuroticism",
    header: "Neuroticism",
    accessorFn: (row) => row.currentAttempt?.personality?.neuroticism,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="text-center">{value !== undefined ? value : "N/A"}</div>
      );
    },
  },
  {
    id: "openness",
    header: "Openness",
    accessorFn: (row) => row.currentAttempt?.personality?.openness,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="text-center">{value !== undefined ? value : "N/A"}</div>
      );
    },
  },
  {
    id: "stress",
    header: "Stress",
    accessorFn: (row) => row.currentAttempt?.stress,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="text-center">{value !== undefined ? value : "N/A"}</div>
      );
    },
  },
  {
    id: "rational",
    header: "Rational",
    accessorFn: (row) => row.currentAttempt?.decisionStyle?.rational,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="text-center">{value !== undefined ? value : "N/A"}</div>
      );
    },
  },
  {
    id: "intuitive",
    header: "Intuitive",
    accessorFn: (row) => row.currentAttempt?.decisionStyle?.intuitive,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="text-center">{value !== undefined ? value : "N/A"}</div>
      );
    },
  },
  {
    id: "resilience",
    header: "Resilience",
    accessorFn: (row) => row.currentAttempt?.resilience,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="text-center">{value !== undefined ? value : "N/A"}</div>
      );
    },
  },
  {
    id: "taxpayerJudgement",
    header: "Taxpayer Judgement",
    accessorFn: (row) => row.currentAttempt?.taxpayerJudgement,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="text-center">{value !== undefined ? value : "N/A"}</div>
      );
    },
  },
  {
    id: "empathy",
    header: "CBIC Empathy",
    accessorFn: (row) => row.currentAttempt?.cbic?.empathy,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="text-center">{value !== undefined ? value : "N/A"}</div>
      );
    },
  },
  {
    id: "emotional",
    header: "CBIC Emotional",
    accessorFn: (row) => row.currentAttempt?.cbic?.emotional,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="text-center">{value !== undefined ? value : "N/A"}</div>
      );
    },
  },
  {
    id: "decision",
    header: "CBIC Decision",
    accessorFn: (row) => row.currentAttempt?.cbic?.decision,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="text-center">{value !== undefined ? value : "N/A"}</div>
      );
    },
  },
];
