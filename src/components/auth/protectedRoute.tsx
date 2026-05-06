import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Loader from "../common/loader";

interface ProtectedRouteProp {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProp) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        navigate("/login");
      }
    };
    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAuthorized(false);
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isAuthorized === null) {
    return (
      <div className="grid place-items-center h-screen">
        <Loader />
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}

export default ProtectedRoute;
