// Package githubapi provides a client for fetching GitHub repository data.
// It uses the GraphQL API to retrieve a user's pinned repositories,
// which represent their curated best work rather than most-recently-updated repos.
package githubapi

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

const (
	userAgent   = "portfolio-site"
	graphqlURL  = "https://api.github.com/graphql"
	pinnedQuery = `
query($login: String!) {
  user(login: $login) {
    pinnedItems(first: 6, types: [REPOSITORY]) {
      nodes {
        ... on Repository {
          name
          description
          url
          primaryLanguage { name }
          stargazerCount
          forkCount
          updatedAt
          homepageUrl
          repositoryTopics(first: 5) {
            nodes { topic { name } }
          }
        }
      }
    }
  }
}
`
)

// Project represents a GitHub repository for display on the portfolio.
type Project struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	URL         string   `json:"url"`
	Language    string   `json:"language"`
	Stars       int      `json:"stars"`
	Forks       int      `json:"forks"`
	UpdatedAt   string   `json:"updatedAt"`
	HomepageURL string   `json:"homepageUrl"`
	Topics      []string `json:"topics"`
}

// graphQL request/response types
type graphqlRequest struct {
	Query     string         `json:"query"`
	Variables map[string]any `json:"variables"`
}

type graphqlResponse struct {
	Data   graphqlData    `json:"data"`
	Errors []graphqlError `json:"errors"`
}

type graphqlError struct {
	Message string `json:"message"`
}

type graphqlData struct {
	User graphqlUser `json:"user"`
}

type graphqlUser struct {
	PinnedItems graphqlPinnedItems `json:"pinnedItems"`
}

type graphqlPinnedItems struct {
	Nodes []graphqlRepo `json:"nodes"`
}

type graphqlRepo struct {
	Name            string              `json:"name"`
	Description     string              `json:"description"`
	URL             string              `json:"url"`
	PrimaryLanguage *graphqlLanguage    `json:"primaryLanguage"`
	StargazerCount  int                 `json:"stargazerCount"`
	ForkCount       int                 `json:"forkCount"`
	UpdatedAt       string              `json:"updatedAt"`
	HomepageURL     string              `json:"homepageUrl"`
	RepositoryTopics graphqlTopics      `json:"repositoryTopics"`
}

type graphqlLanguage struct {
	Name string `json:"name"`
}

type graphqlTopics struct {
	Nodes []graphqlTopicNode `json:"nodes"`
}

type graphqlTopicNode struct {
	Topic graphqlTopic `json:"topic"`
}

type graphqlTopic struct {
	Name string `json:"name"`
}

// FetchProjects retrieves the user's pinned repositories via the GitHub GraphQL API.
// If no token is provided, it falls back to the REST API (unauthenticated, 60 req/hr limit).
func FetchProjects(ctx context.Context, client *http.Client, username, token string) ([]Project, error) {
	if token != "" {
		return fetchPinnedProjects(ctx, client, username, token)
	}
	// Fallback to REST API when no token is available (e.g., local dev without token)
	return fetchRESTProjects(ctx, client, username)
}

// fetchPinnedProjects uses the GraphQL API to get the user's pinned repositories.
func fetchPinnedProjects(ctx context.Context, client *http.Client, username, token string) ([]Project, error) {
	body, err := json.Marshal(graphqlRequest{
		Query:     pinnedQuery,
		Variables: map[string]any{"login": username},
	})
	if err != nil {
		return nil, fmt.Errorf("marshal graphql request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, graphqlURL, bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("create graphql request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", userAgent)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("perform graphql request: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected github graphql status: %s", resp.Status)
	}

	var gqlResp graphqlResponse
	if err := json.NewDecoder(resp.Body).Decode(&gqlResp); err != nil {
		return nil, fmt.Errorf("decode graphql response: %w", err)
	}
	if len(gqlResp.Errors) > 0 {
		return nil, fmt.Errorf("graphql error: %s", gqlResp.Errors[0].Message)
	}

	nodes := gqlResp.Data.User.PinnedItems.Nodes
	projects := make([]Project, 0, len(nodes))
	for _, n := range nodes {
		p := Project{
			Name:        n.Name,
			Description: n.Description,
			URL:         n.URL,
			Stars:       n.StargazerCount,
			Forks:       n.ForkCount,
			UpdatedAt:   n.UpdatedAt,
			HomepageURL: n.HomepageURL,
		}
		if n.PrimaryLanguage != nil {
			p.Language = n.PrimaryLanguage.Name
		}
		for _, tn := range n.RepositoryTopics.Nodes {
			p.Topics = append(p.Topics, tn.Topic.Name)
		}
		projects = append(projects, p)
	}
	return projects, nil
}

// restProject is the raw shape returned by the GitHub REST API.
type restProject struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	HTMLURL     string `json:"html_url"`
	Language    string `json:"language"`
	Stars       int    `json:"stargazers_count"`
	Forks       int    `json:"forks_count"`
	UpdatedAt   string `json:"updated_at"`
	Homepage    string `json:"homepage"`
}

// fetchRESTProjects is the unauthenticated fallback using the REST API.
func fetchRESTProjects(ctx context.Context, client *http.Client, username string) ([]Project, error) {
	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodGet,
		fmt.Sprintf("https://api.github.com/users/%s/repos?sort=updated&per_page=12", username),
		nil,
	)
	if err != nil {
		return nil, fmt.Errorf("create rest request: %w", err)
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", userAgent)

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("perform rest request: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected github rest status: %s", resp.Status)
	}

	var raw []restProject
	if err := json.NewDecoder(resp.Body).Decode(&raw); err != nil {
		return nil, fmt.Errorf("decode rest response: %w", err)
	}

	projects := make([]Project, 0, len(raw))
	for _, r := range raw {
		projects = append(projects, Project{
			Name:        r.Name,
			Description: r.Description,
			URL:         r.HTMLURL,
			Language:    r.Language,
			Stars:       r.Stars,
			Forks:       r.Forks,
			UpdatedAt:   r.UpdatedAt,
			HomepageURL: r.Homepage,
		})
	}
	return projects, nil
}
