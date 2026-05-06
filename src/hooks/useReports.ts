import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { ReportProps } from "../types/report.types";

const useReports = () => {
  const [data, setData] = useState<ReportProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) setError(error.message);
      else setData(data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  return { data, loading, error };
};

export default useReports;
