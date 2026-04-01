import { getAllPosts } from "@/lib/posts-service";
import { getRubrics } from "@/lib/remote-rubrics";
import { TopBar } from "@/components/layout/TopBar";

export async function TopBarSection() {
  const [allPosts, rubrics] = await Promise.all([getAllPosts(), getRubrics()]);
  return <TopBar materials={allPosts.length} rubrics={rubrics.length} />;
}
