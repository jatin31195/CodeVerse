const axios = require('axios');

async function fetchGFGPOTD() {
    try {
        const url = 'https://practiceapi.geeksforgeeks.org/api/vr/problems-of-day/problem/today/';
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("GFG API Error:", error.message);
        throw new Error("Failed to fetch today's POTD from GFG.");
    }
}

async function fetchPreviousGFGPOTD(year, month) {
    try {
        const url = `https://practiceapi.geeksforgeeks.org/api/vr/problems-of-day/problems/previous/?year=${year}&month=${month}`;
        const response = await axios.get(url);
        return response.data.results || []; 
    } catch (error) {
        console.error(`Failed to fetch POTD for ${year}-${month}:`, error.message);
        return []; 
    }
}

async function fetchGFGPOTDByDate(date) {
    try {
        const today = new Date().toISOString().split("T")[0]; 

        if (date === today) {
            return await fetchGFGPOTD(); 
        }

        let [year, month, day] = date.split("-").map(Number);
        let problemFound = null;

        while (!problemFound && (year > 2021 || (year === 2021 && month >= 1))) {
            const problems = await fetchPreviousGFGPOTD(year, month.toString().padStart(2, "0"));

            problemFound = problems.find(problem => problem.date.startsWith(date));

            if (!problemFound) {
                month -= 1;
                if (month === 0) {
                    month = 12;
                    year -= 1;
                }
            }
        }

        if (!problemFound) {
            throw new Error(`No POTD found for ${date}`);
        }

        return problemFound;
    } catch (error) {
        console.error("GFG POTD by Date Error:", error.message);
        throw new Error("Failed to fetch POTD for the given date.");
    }
}

module.exports = { fetchGFGPOTDByDate };
