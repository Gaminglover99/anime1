import { db } from "../server/db";
import { 
  animes, 
  animeGenres,
  seasons,
  episodes,
  videoSources,
  animeTypeEnum,
  animeStatusEnum
} from "../shared/schema";

async function main() {
  console.log("Starting quick seeding...");

  // Create anime entries with explicit enum types
  const animeList = [
    {
      title: "One Piece",
      description: "Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger. The famous mystery treasure named 'One Piece'.",
      type: animeTypeEnum.enumValues[0], // "TV"
      status: animeStatusEnum.enumValues[1], // "Ongoing"
      releaseYear: 1999,
      rating: 8.7,
      duration: "24 min",
      coverImage: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
      bannerImage: "https://cdn.myanimelist.net/images/anime/6/73245l.jpg",
      featured: true
    },
    {
      title: "Jujutsu Kaisen",
      description: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman school to be able to locate the demon's other body parts and thus exorcise himself.",
      type: animeTypeEnum.enumValues[0], // "TV"
      status: animeStatusEnum.enumValues[1], // "Ongoing" 
      releaseYear: 2020,
      rating: 8.8,
      duration: "23 min",
      coverImage: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
      bannerImage: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
      featured: true
    }
  ];

  // Create the anime entries
  for (const animeData of animeList) {
    const [createdAnime] = await db.insert(animes).values(animeData).returning();
    console.log(`Created anime: ${createdAnime.title}`);
    
    // Add genre relationships - use actual genre IDs from the database
    const genreIds = [16, 30, 20]; // Action, Adventure, Comedy
    for (const genreId of genreIds) {
      await db.insert(animeGenres).values({
        animeId: createdAnime.id,
        genreId
      });
    }
    
    // Create seasons
    const seasonCount = 2; // Just 2 seasons for each anime
    for (let i = 1; i <= seasonCount; i++) {
      const [createdSeason] = await db.insert(seasons).values({
        animeId: createdAnime.id,
        number: i,
        title: `Season ${i}`
      }).returning();
      
      console.log(`Created season ${i} for ${createdAnime.title}`);
      
      // Create episodes for season
      const episodeCount = 2; // Just 2 episodes per season for faster seeding
      for (let j = 1; j <= episodeCount; j++) {
        const [createdEpisode] = await db.insert(episodes).values({
          seasonId: createdSeason.id,
          number: j,
          title: `Episode ${j}`,
          description: `This is episode ${j} of season ${i} for ${createdAnime.title}`,
          duration: "24:00",
          thumbnail: createdAnime.coverImage
        }).returning();
        
        // Add video sources for the episode
        await db.insert(videoSources).values({
          episodeId: createdEpisode.id,
          quality: "720p",
          url: "https://example.com/video/720p.mp4",
          size: "300MB"
        });
        
        await db.insert(videoSources).values({
          episodeId: createdEpisode.id,
          quality: "1080p",
          url: "https://example.com/video/1080p.mp4",
          size: "800MB"
        });
      }
    }
  }

  console.log("Quick seeding complete!");
}

main().catch(e => {
  console.error("Error during seeding:", e);
  process.exit(1);
}).finally(() => {
  process.exit(0);
});