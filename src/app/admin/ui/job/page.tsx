// app/users/page.tsx
import React from "react";
import JobTable from "@/app/components/jobs/JobTable";

export default function UsersPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Job</h2>
      </div>
      <JobTable />
    </div>
  );
}