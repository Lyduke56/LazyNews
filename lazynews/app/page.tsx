import Navbar from '@/components/Navbar';
import NewsClient from '@/components/NewsClient';
import { getArticles } from '@/app/api/articles/route';
import { Article } from '@/types/article';

// Revalidate the page at most every 5 minutes on the CDN edge,
// matching the API route's Cache-Control header.
export const revalidate = 300;

export default async function Home() {
  let bangerArticles: Article[] = [];
  let otherArticles: Article[] = [];
  let fetchedAt = new Date().toISOString();

  try {
    const data = await getArticles();
    fetchedAt = data.fetchedAt;

    bangerArticles = data.articles.filter((a) => a.isBanger);
    otherArticles = data.articles.filter((a) => !a.isBanger);
  } catch (err) {
    console.error('[page] Failed to load articles during SSR:', err);
    // NewsClient will receive empty arrays and show empty state gracefully
  }

  return (
    <div id="top-headlines" className="min-h-screen bg-[#F2F2F2] scroll-mt-[41px]">
      <Navbar />

      <NewsClient
        initialBangers={bangerArticles}
        initialOthers={otherArticles}
        fetchedAt={fetchedAt}
      />

      {/* FOOTER */}
      <footer className="w-full flex justify-center border-t-2 border-[#d2cac5] bg-[#F2F2F2] py-8 mt-2 opacity-80">
        <div className="w-[1200px] flex justify-between items-center font-display text-[#847f7c] text-sm">
          <span>© 2026 LazyNews by Lyduke.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#32302f] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#32302f] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#32302f] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
