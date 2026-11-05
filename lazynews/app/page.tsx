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
    fetchedAt = data.entry.fetchedAt;

    bangerArticles = data.entry.articles.filter((a) => a.isBanger);
    otherArticles = data.entry.articles.filter((a) => !a.isBanger);
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
        <div className="w-full max-w-[1200px] px-4 flex flex-col sm:flex-row justify-between items-center font-display text-[#847f7c] text-sm gap-4">
          <span>© 2026 LazyNews by Lyduke.</span>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="#" className="hover:text-[#32302f] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#32302f] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#32302f] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
