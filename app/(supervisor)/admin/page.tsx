import { createClient } from "@/utils/supabase/server";
import { SupervisorDashboard } from "@/components/supervisor/supervisor-dashboard";

export default async function AdminPage() {
  const supabase = await createClient();

  // Murni cuma narik data reports. Satpam udah diurus proxy.
  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .order("timestamp", { ascending: false });

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Monitoring laporan harian Kuy Studio.
        </p>
      </div>

      {/* Lempar data ke Client Component */}
      <SupervisorDashboard reports={reports || []} />
    </div>
  );
}
