import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  publishedAt: string;
}

const NewsSection = () => {
  const { data: newsItems, isLoading } = useQuery<NewsItem[]>({
    queryKey: ['/api/news'],
  });

  // Format the time ago for news items
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - past.getTime());
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  };

  return (
    <section className="py-8 container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-poppins">Anime News & Updates</h2>
        <Link href="/news">
          <a className="text-[#6C5CE7] hover:text-[#6C5CE7]/80 font-medium flex items-center">
            More News <i className="fas fa-chevron-right ml-2 text-xs"></i>
          </a>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse bg-[#1E1E1E] rounded-lg overflow-hidden">
              <div className="aspect-[16/9] bg-[#2D2D2D]"></div>
              <div className="p-4">
                <div className="h-6 bg-[#2D2D2D] rounded mb-2"></div>
                <div className="h-4 bg-[#2D2D2D] rounded mb-2"></div>
                <div className="h-4 bg-[#2D2D2D] rounded mb-2 w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems?.map(item => (
            <div key={item.id} className="bg-[#1E1E1E] rounded-lg overflow-hidden hover:bg-[#2D2D2D] transition-colors">
              <div className="aspect-[16/9] bg-[#2D2D2D] overflow-hidden">
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-[#BBBBBB] line-clamp-2 mb-3">{item.content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#BBBBBB]">{getTimeAgo(item.publishedAt)}</span>
                  <Link href={`/news/${item.id}`}>
                    <a className="text-[#6C5CE7] text-sm hover:underline">Read More</a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default NewsSection;
