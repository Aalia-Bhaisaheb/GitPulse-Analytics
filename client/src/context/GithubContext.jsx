import React, { createContext, useContext, useState } from 'react';

const GithubContext = createContext();

export const GithubProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUser = async (username) => {
        setLoading(true);
        setError(null);
        try {
            const query = `
                query($login: String!) {
                    user(login: $login) {
                        name
                        login
                        avatarUrl
                        bio
                        createdAt
                        followers {
                            totalCount
                        }
                        repositories(first: 100, ownerAffiliations: OWNER) {
                            totalCount
                            nodes {
                                languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                                    edges {
                                        size
                                        node {
                                            name
                                            color
                                        }
                                    }
                                }
                            }
                        }
                        contributionsCollection {
                            contributionCalendar {
                                totalContributions
                                weeks {
                                    contributionDays {
                                        contributionCount
                                        date
                                    }
                                }
                            }
                        }
                    }
                }
            `;
            const response = await fetch('http://localhost:5000/api/github', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, variables: { login: username } }),
            });
            const result = await response.json();
            
            if (!response.ok) {
                setError(result.message || 'Failed to fetch user data');
                setUserData(null);
            } else if (result.errors) {
                setError(result.errors[0].message);
                setUserData(null);
            } else if (!result.data || !result.data.user) {
                setError('User not found');
                setUserData(null);
            } else {
                setUserData(result.data.user);
            }
        } catch (err) {
            setError('Connection error: could not reach the server');
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GithubContext.Provider value={{ userData, loading, error, fetchUser }}>
            {children}
        </GithubContext.Provider>
    );
};

export const useGithub = () => useContext(GithubContext);
