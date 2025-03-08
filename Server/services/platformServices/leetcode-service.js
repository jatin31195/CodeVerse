const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

async function fetchLeetCodePOTD() {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // GraphQL expects 1-based month index
        const query = `
            query dailyPOTD($year: Int!, $month: Int!) {
              dailyCodingChallengeV2(year: $year, month: $month) {
                challenges {
                  date
                  link
                  question {
                    questionFrontendId
                    title
                    titleSlug
                    difficulty
                    topicTags {
                      name
                    }
                  }
                }
              }
            }
        `;

        const variables = { year, month };

        const response = await axios.post('https://leetcode.com/graphql/', 
            { query, variables },
            { headers: { 'Content-Type': 'application/json' } }
        );

        // Check for missing data
        if (!response.data.data) {
            console.error("No data received from LeetCode API:", response.data);
            throw new Error("No data received from LeetCode API");
        }

        // Extract challenges data
        const challenges = response.data.data?.dailyCodingChallengeV2?.challenges || [];

        if (challenges.length === 0) {
            console.log('No challenge found for today.');
            return [];
        }

        // Map the challenges to the required format
        return challenges.map(challenge => {
            const question = challenge.question;
            const topicTags = question.topicTags.map(tag => tag.name).join(", "); // Join topics into a single string

            return {
                _id: uuidv4(),
                platform: "LeetCode",
                title: question.title,
                link: `https://leetcode.com${challenge.link}`,
                problem_id: question.questionFrontendId,
                date: challenge.date,
                difficulty: question.difficulty,
                topics: topicTags,
            };
        });

    } catch (error) {
        console.error("LeetCode API Error:", error.message);
        // Log full error object for debugging
        console.error("Full error details:", error);
        throw new Error("Failed to fetch POTD from LeetCode.");
    }
}

module.exports = { fetchLeetCodePOTD };
