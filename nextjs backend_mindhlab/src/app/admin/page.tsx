import { AdminApp } from "../../admin/AdminApp";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Portal | MINDH Laboratory",
  description: "Administrative console for managing research publications, lab team, announcements, and telemetry facilities.",
};

export default function Page() {
  return <AdminApp />;
}
