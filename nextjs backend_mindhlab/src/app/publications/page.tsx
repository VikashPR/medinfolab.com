import { PublicationsPage } from "../../views/PublicationsPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Publications | MINDH Laboratory",
  description: "Peer-reviewed papers, clinical validations, preprints, and open source benchmarks from the MINDH Laboratory.",
};

export default function Page() {
  return <PublicationsPage />;
}
