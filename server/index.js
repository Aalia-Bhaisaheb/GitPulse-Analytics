require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini
// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// GitHub GraphQL Endpoint Placeholder
app.post('/api/github', async (req, res) => {
    const { query, variables } = req.body;
    try {
        const response = await axios.post(
            'https://api.github.com/graphql',
            { query, variables },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('GitHub API Error:', error.response?.data || error.message);

        // Proper error mapping for the frontend
        if (error.response?.status === 401) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid or missing GITHUB_TOKEN. Please check your server/.env file.'
            });
        }

        if (error.response?.status === 404) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'GitHub user not found.'
            });
        }

        res.status(error.response?.status || 500).json({
            error: 'GitHub Error',
            message: error.response?.data?.message || 'Failed to fetch GitHub data'
        });
    }
});

// Gemini Roast/Toast Endpoint
app.post('/api/ai-review', async (req, res) => {
    const { userData, type } = req.body; // type: 'roast' or 'toast'
    console.log(`POST /api/ai-review 200 - Type: ${type}`);
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const dataSummary = {
            username: userData.login,
            bio: userData.bio,
            followers: userData.followers?.totalCount || 0,
            repositories: userData.repositories?.totalCount || 0,
            contributions: userData.contributionsCollection?.contributionCalendar?.totalContributions || 0,
            topLanguage: userData.repositories?.nodes[0]?.languages?.edges[0]?.node?.name || 'N/A'
        };

        const prompt = type === 'roast'
            ? `You are a sarcastic senior developer. Roast this GitHub profile based on this data: ${JSON.stringify(dataSummary)}. Keep it under 3 sentences.`
            : `You are a supportive mentor. Praise this developer's GitHub achievements based on this data: ${JSON.stringify(dataSummary)}. Keep it under 3 sentences.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ review: response.text() });
    } catch (error) {
        console.error('AI Review Error:', error.message);
        res.status(500).json({ error: 'Failed to generate AI review', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
