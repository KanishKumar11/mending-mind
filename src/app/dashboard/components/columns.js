"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

export const columns = [
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
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{format(date, "PPP")}</div>;
    },
  },
  {
    id: "extraversion",
    header: "Extraversion",
    accessorFn: (row) => row.scores?.personality?.extraversion,
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
    accessorFn: (row) => row.scores?.personality?.agreeableness,
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
    accessorFn: (row) => row.scores?.personality?.conscientiousness,
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
    accessorFn: (row) => row.scores?.personality?.neuroticism,
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
    accessorFn: (row) => row.scores?.personality?.openness,
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
    accessorFn: (row) => row.scores?.stress,
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
    accessorFn: (row) => row.scores?.decisionStyle?.rational,
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
    accessorFn: (row) => row.scores?.decisionStyle?.intuitive,
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
    accessorFn: (row) => row.scores?.resilience,
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
    accessorFn: (row) => row.scores?.taxpayerJudgement,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="text-center">{value !== undefined ? value : "N/A"}</div>
      );
    },
  },
];
