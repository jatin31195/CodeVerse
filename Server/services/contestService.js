const axios = require('axios');
const moment = require('moment-timezone');
const fetchUpcomingContests = async () => {
    try {
        const response = await axios.get('https://codeforces.com/api/contest.list');
        
        if (response.data.status !== 'OK') {
            throw new Error('Failed to fetch contests');
        }
        
        return response.data.result
            .filter(contest => 
                contest.phase === 'BEFORE' &&
                /Div\.\s?[1234]/.test(contest.name)
            )
            .map(contest => ({
                ...contest,
                startTimeIST: moment.unix(contest.startTimeSeconds).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss')
            }));
    } catch (error) {
        console.error('Error fetching Codeforces contests:', error);
        throw error;
    }
};
const fetchUpcomingLeetCodeContests = async () => {
    try {
        const query = {
            query: `
                {
                    topTwoContests {
                        title
                        titleSlug
                        startTime
                        duration
                    }
                }
            `
        };

        const response = await axios.post('https://leetcode.com/graphql', query, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.data || !response.data.data || !response.data.data.topTwoContests) {
            throw new Error('Failed to fetch LeetCode contests');
        }

        return response.data.data.topTwoContests.map(contest => ({
            name: contest.title,
            platform: 'LeetCode',
            url: `https://leetcode.com/contest/${contest.titleSlug}`,
            startTimeIST: moment.unix(contest.startTime).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
            durationMinutes: contest.duration / 60
        }));
    } catch (error) {
        console.error('Error fetching LeetCode contests:', error);
        return [];
    }
};
const CLIST_API_URL = 'https://clist.by/api/v1/contest/';
const CLIST_USERNAME = 'jatininnocnet';
const CLIST_API_KEY = '85351f912d4de4bfbee0f20dd02ad5c06a22402f';
const GFG_RESOURCE_ID = 126;

const fetchUpcomingGFGContests = async () => {
    try {
        
        const now = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ssZZ');
        const response = await axios.get(CLIST_API_URL, {
            params: {
                resource__id: GFG_RESOURCE_ID,  
                start__gt: now,                
                order_by: 'start',
                format: 'json',
            },
            headers: {
                'Authorization': `ApiKey ${CLIST_USERNAME}:${CLIST_API_KEY}`
            }
        });

        let contests = [];
   
        if (Array.isArray(response.data.objects)) {
            contests = response.data.objects.map(contest => ({
                name: contest.event,
                platform: 'GeeksforGeeks',
                startTimeIST: moment(contest.startTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
                durationMinutes: contest.duration / 60,
                url: contest.href
            }));
        }
      
        else if (response.data.objects && Array.isArray(response.data.objects.contest)) {
            contests = response.data.objects.contest.map(contest => ({
                name: contest.event,
                platform: 'GeeksforGeeks',
                startTimeIST: moment(contest.start).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
                durationMinutes: contest.duration / 60,
                url: contest.href
            }));
        } else {
            console.warn('Unexpected response structure:', response.data);
        }
        
        return contests;
    } catch (error) {
        console.error('Error fetching GFG contests:', error.response?.data || error.message);
        return [];
    }
};
module.exports = { fetchUpcomingContests ,fetchUpcomingLeetCodeContests,fetchUpcomingGFGContests};
