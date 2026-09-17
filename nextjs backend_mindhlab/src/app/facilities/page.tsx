import { FacilitiesPage } from "../../views/FacilitiesPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Laboratory Facilities & Testing Rigs | MINDH Laboratory",
  description: "Specialized experimental rigs, optical telemetry darkrooms, GPU clusters, and clinical audit suites.",
};

export default function Page() {
  return <FacilitiesPage />;
}
