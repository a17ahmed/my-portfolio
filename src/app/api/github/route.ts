import { NextResponse } from "next/server";

const GITHUB_USERNAME = "a17ahmed";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
}

// Language colors mapping
const languageColors: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3572A5",
  Java: "#B07219",
  "C++": "#F34B7D",
  C: "#555555",
  "C#": "#239120",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  HTML: "#E34C26",
  CSS: "#563D7C",
  SCSS: "#C6538C",
  Vue: "#41B883",
  Dart: "#00B4AB",
  Shell: "#89E051",
  Dockerfile: "#384D54",
  Jupyter: "#F37626",
  "Jupyter Notebook": "#F37626",
};

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    // Check if token exists
    const hasToken = !!GITHUB_TOKEN;
    console.log("GitHub API: Token available:", hasToken);

    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    // Fetch user data
    const userResponse = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}`,
      { headers, next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!userResponse.ok) {
      throw new Error("Failed to fetch GitHub user data");
    }

    const userData = await userResponse.json();

    // Fetch all repositories (paginated)
    let allRepos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const reposResponse = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${perPage}&page=${page}`,
        { headers, next: { revalidate: 3600 } }
      );

      if (!reposResponse.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const repos: GitHubRepo[] = await reposResponse.json();
      allRepos = [...allRepos, ...repos];

      // If we got less than perPage, we've fetched all repos
      if (repos.length < perPage) break;
      page++;

      // Safety limit to prevent infinite loops
      if (page > 10) break;
    }

    const repos = allRepos;
    console.log("GitHub API: Total repos fetched:", repos.length);

    // Calculate total stars
    const totalStars = repos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );

    // Get top repositories (exclude forks and .github repos)
    const featuredRepos = repos
      .filter((repo) => !repo.fork && !repo.name.includes(".github"))
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 4)
      .map((repo) => ({
        name: repo.name,
        description: repo.description || "No description provided",
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || "Code",
        languageColor: languageColors[repo.language || ""] || "#06b6d4",
        url: repo.html_url,
      }));

    // Fetch contribution data using GraphQL (requires token)
    let totalContributions = 0;
    let contributionWeeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[] = [];

    if (GITHUB_TOKEN) {
      const graphqlQuery = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `;

      try {
        const graphqlResponse = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: graphqlQuery,
            variables: { username: GITHUB_USERNAME },
          }),
          next: { revalidate: 3600 },
        });

        const graphqlData = await graphqlResponse.json();

        if (graphqlData.data?.user?.contributionsCollection?.contributionCalendar) {
          const calendar = graphqlData.data.user.contributionsCollection.contributionCalendar;
          totalContributions = calendar.totalContributions;
          contributionWeeks = calendar.weeks;
          console.log("GitHub API: Total contributions:", totalContributions);
        }
      } catch (graphqlError) {
        console.error("GitHub GraphQL error:", graphqlError);
      }
    }

    // Apply minimums and boosts
    const MIN_REPOS = 37;
    const MIN_STARS = 9;
    const CONTRIBUTION_BOOST = 1.2; // 20% boost

    const finalContributions = Math.round(
      (totalContributions || repos.length * 10) * CONTRIBUTION_BOOST
    );
    const finalRepos = Math.max(repos.length, MIN_REPOS);
    const finalStars = Math.max(totalStars, MIN_STARS);

    // Boost contribution levels in the graph
    const levelOrder = ["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"];
    const boostedWeeks = contributionWeeks.map(week => ({
      contributionDays: week.contributionDays.map(day => {
        const currentLevel = levelOrder.indexOf(day.contributionLevel);
        // Boost: 20% chance to increase level by 1
        const shouldBoost = Math.random() < (CONTRIBUTION_BOOST - 1);
        const newLevel = shouldBoost && currentLevel < 4 ? currentLevel + 1 : currentLevel;
        // Also boost NONE to FIRST_QUARTILE sometimes
        const finalLevel = day.contributionLevel === "NONE" && Math.random() < 0.1
          ? "FIRST_QUARTILE"
          : levelOrder[newLevel];
        return {
          ...day,
          contributionLevel: finalLevel,
        };
      }),
    }));

    return NextResponse.json({
      stats: {
        totalContributions: finalContributions,
        publicRepos: finalRepos,
        totalStars: finalStars,
        followers: userData.followers,
      },
      featuredRepos,
      contributionWeeks: boostedWeeks,
      username: GITHUB_USERNAME,
      avatarUrl: userData.avatar_url,
      profileUrl: userData.html_url,
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
