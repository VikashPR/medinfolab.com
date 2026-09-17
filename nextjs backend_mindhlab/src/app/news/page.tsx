import { NewsPage } from "../../views/NewsPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "News & Announcements | MINDH Laboratory",
  description: "Latest research grants, hospital trials, benchmark awards, and lab wire updates.",
};

export default function Page() {
  return <NewsPage />;
}
