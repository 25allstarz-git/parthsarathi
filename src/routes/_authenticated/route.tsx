import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("parthsarathi_demo_judicial") === "true") {
        return {
          user: {
            id: "d3000000-0000-0000-0000-000000000001",
            email: "justice.mehta@parthsarathi.in",
            user_metadata: { full_name: "Hon'ble Justice A. Mehta" },
          },
        };
      }
      if (localStorage.getItem("parthsarathi_demo_lawyer") === "true") {
        return {
          user: {
            id: "u1000000-0000-0000-0000-000000000001",
            email: "advocate.rajesh@parthsarathi.in",
            user_metadata: { full_name: "Adv. Rajesh V. Sharma" },
          },
        };
      }
      if (localStorage.getItem("parthsarathi_demo_citizen") === "true") {
        return {
          user: {
            id: "511da54d-3f78-47b6-97e4-9e56e1c0b8fc",
            email: "demo.citizen@gmail.com",
            user_metadata: { full_name: "Demo Citizen" },
          },
        };
      }
    }
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: () => <Outlet />,
});
