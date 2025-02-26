"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

export default function DateSelector({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDateChange = (date: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", date);
    
    // Preserve existing page parameter
    const page = searchParams.get("page");
    if (page) {
      params.set("page", page);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <Input
      type="date"
      defaultValue={defaultValue}
      onChange={(e) => handleDateChange(e.target.value)}
      className="w-full p-2 rounded-md"
    />
  );
}