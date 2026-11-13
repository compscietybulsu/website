import SiteShell from "@/components/site/SiteShell";
import Datacamp from "@/components/site/Datacamp";

export const metadata = {
  title: "Datacamp",
  description: "Explore Datacamp learning opportunities for CompSciety members.",
};

export default function DatacampPage() {
  return (
    <SiteShell>
      <Datacamp />
    </SiteShell>
  );
}
