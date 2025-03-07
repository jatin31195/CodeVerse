const axios = require('axios');

async function fetchLeetCodePOTD() {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; 
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

        console.log("LeetCode API Response:", JSON.stringify(response.data, null, 2)); // Debug log

        return response.data.data?.dailyCodingChallengeV2?.challenges || [];
    } catch (error) {
        console.error("LeetCode API Error:", error.message);
        throw new Error("Failed to fetch POTD from LeetCode.");
    }
}

module.exports = { fetchLeetCodePOTD };
