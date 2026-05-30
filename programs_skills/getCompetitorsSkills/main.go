package main

import (
	"fmt"
	"net/url"
	"io/ioutil"
	"encoding/json"
	"net/http"
	"os"
	"bytes"
	"time"
	"strings"
	"github.com/joho/godotenv"
)

type SkillmoreTokenResponse struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int    `json:"expires_in"`
	TokenType   string `json:"token_type"`
}

type TokenResponse struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int    `json:"expires_in"`
	TokenType   string `json:"token_type"`
	Scope       string `json:"scope"`
}

type RequestBody struct {
	Filter struct {
		When    TimeRange `json:"when"`
		Company []string  `json:"company_name"`
	} `json:"filter"`
	Fields []string `json:"fields"`
	Limit  int      `json:"limit"`
}

type TimeRange struct {
	Start string `json:"start"`
	End   string `json:"end"`
}

type Response struct {
	Data struct {
		Limit          int `json:"limit"`
		Page           int `json:"page"`
		PagesAvailable int `json:"pages_available"`
		Postings       []struct {
			ID         string   `json:"id"`
			Posted     string   `json:"posted"`
			CityName   string   `json:"city_name"`
			TitleName  string   `json:"title_name"`
			SkillsName []string `json:"skills_name"`
		} `json:"postings"`
	} `json:"data"`
	UniquePostings int `json:"unique_postings"`
	TotalPostings  int `json:"total_postings"`
}

type StructToResponse struct {
	Company       string   `json:"company"`
	TotalPostings int      `json:"total_postings"`
	TotalSkills   int      `json:"total_skills"`
	Skills        []string `json:"skills"`
}

type OrgSkills struct {
	OrgSkillsId      int    `json:"orgSkillId"`
	SkillId          string `json:"skillId"`
	SkillName        string `json:"skillName"`
	CategoryName     string `json:"categoryName"`
	SubcategoryName  string `json:"subcategoryName"`
	CreatedAt        string `json:"createdAt"`
	UpdatedAt        string `json:"updatedAt"`
	EmployeeCount    int    `json:"employeeCount"`
	EmployeeAvgLevel struct {
		String string `json:"String"`
		Valid  bool   `json:"Valid"`
	} `json:"employeeAvgLevel"`
}

type OrgSkillsResponse struct {
	Skills     []OrgSkills `json:"skills"`
	OrgId      int         `json:"org_id"`
	Harmozined []struct{}  `json:"harmozined"`
}

type JSONResponse struct {
	CommonSkills   []string                       `json:"common_skills"`
	MissingSkills  []string                       `json:"missing_skills"`
	Competitors    map[string]map[string]bool     `json:"competitors"`
	OrgSkills      []string                       `json:"org_skills"`
	OrgId          int                            `json:"org_id"`
	AllCompetitors []StructToResponse             `json:"all_competitors"`
}

func apiTokenGenerate(params url.Values) (string, error) {
	resp, err := http.PostForm("https://auth.emsicloud.com/connect/token", params)
	if err != nil {
		return "", fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("error reading response body: %w", err)
	}
	response := TokenResponse{}
	err = json.Unmarshal(body, &response)
	if err != nil {
		fmt.Printf("Reading body failed: %s", err)
		return "", err
	}
	return response.AccessToken, nil
}

func apiSkillmoreTokenGenerate(params url.Values) (string, error) {
	reqBody := bytes.NewBufferString(params.Encode())
	req, err := http.NewRequest("POST", "https://api.skillmore.cloud/access-token", reqBody)
	if err != nil {
		return "", fmt.Errorf("error creating request: %w", err)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("x-api-key", os.Getenv("X_API_KEY"))
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("error reading response body: %w", err)
	}
	response := SkillmoreTokenResponse{}
	err = json.Unmarshal(body, &response)
	if err != nil {
		return "", fmt.Errorf("unmarshalling response failed: %w", err)
	}
	return response.AccessToken, nil
}

func formatData(data Response) []string {
	skillSet := make(map[string]struct{})
	for _, posting := range data.Data.Postings {
		skills := posting.SkillsName
		for _, skill := range skills {
			if _, exists := skillSet[skill]; !exists {
				skillSet[skill] = struct{}{}
			}
		}
	}
	var formattedData []string
	for skill := range skillSet {
		formattedData = append(formattedData, skill)
	}
	return formattedData
}

func getOrgSkills(org string, token string) (OrgSkillsResponse, error) {
	req, err := http.NewRequest("GET", fmt.Sprintf("https://api.skillmore.cloud/v2/taxonomy/org/%s/skill-inventory", org), nil)
	if err != nil {
		return OrgSkillsResponse{}, fmt.Errorf("error creating request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("x-api-key", os.Getenv("X_API_KEY"))
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return OrgSkillsResponse{}, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return OrgSkillsResponse{}, fmt.Errorf("error reading response body: %w", err)
	}
	skills := OrgSkillsResponse{}
	err = json.Unmarshal(body, &skills)
	if err != nil {
		return OrgSkillsResponse{}, fmt.Errorf("unmarshalling response failed: %w", err)
	}
	return skills, nil
}

func getCompetitorSkillsByJobPostings(company string, token string) ([]string, error) {
	currentTime := time.Now()
	requestBody := RequestBody{}
	requestBody.Filter.When = TimeRange{
		Start: "2023-08",
		End:   currentTime.AddDate(0, -1, 0).Format("2006-01"),
	}
	requestBody.Filter.Company = []string{company}
	requestBody.Limit = 100
	requestBody.Fields = []string{"id", "posted", "city_name", "title_name", "skills_name"}
	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return []string{}, fmt.Errorf("error marshalling json: %w", err)
	}
	request, err := http.NewRequest("POST", "https://emsiservices.com/jpa/postings", bytes.NewBuffer(jsonData))
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", "Bearer "+token)
	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return []string{}, fmt.Errorf("error making request: %w", err)
	}
	defer response.Body.Close()
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return []string{}, fmt.Errorf("error reading response body: %w", err)
	}
	responseData := Response{}
	err = json.Unmarshal(body, &responseData)
	if err != nil {
		fmt.Printf("Reading body failed: %s", err)
		return []string{}, err
	}
	formattedData := formatData(responseData)
	return formattedData, nil
}

func compareSkills(skills []string, competitorSkills map[string]map[string]bool) ([]string, []string) {
	var commonSkills []string
	var missingSkills []string
	for _, skill := range skills {
		if _, exists := competitorSkills[skill]; exists {
			commonSkills = append(commonSkills, skill)
		} else {
			missingSkills = append(missingSkills, skill)
		}
	}
	return commonSkills, missingSkills
}

func Run() (interface{}, error) {
	return runCompetitorSkillsLogic(nil)
}

func runCompetitorSkillsLogic(competitors []string) (interface{}, error) {
	if len(competitors) == 0 {
		competitors = []string{
			"Mercy Health",
			"SoutheastHEALTH",
			"Southeast Missouri State University",
			"St. Francis Medical Center",
			"Hospital Sisters Health System",
			"Southeast Missouri Hospital",
			"Southern Illinois Healthcare",
			"BJC HealthCare",
			"Landmark Hospitals",
			"SSM Health Care",
		}
	}
	// Limit to first 3 for performance
	if len(competitors) > 3 {
		competitors = competitors[:3]
	}
	_ = godotenv.Load()
	params := url.Values{}
	params.Add("client_id", os.Getenv("CLIENT_ID"))
	params.Add("client_secret", os.Getenv("CLIENT_SECRET"))
	params.Add("grant_type", "client_credentials")
	accessToken, tokenErr := apiTokenGenerate(params)
	if tokenErr != nil {
		return nil, fmt.Errorf("error generating token: %w", tokenErr)
	}
	skillmoreParams := url.Values{}
	skillmoreParams.Add("client_id", os.Getenv("SKILLMORE_CLIENT_ID"))
	skillmoreParams.Add("client_secret", os.Getenv("SKILLMORE_CLIENT_SECRET"))
	skillmoreParams.Add("grant_type", "client_credentials")
	skillmoreToken, tokenErr := apiSkillmoreTokenGenerate(skillmoreParams)
	if tokenErr != nil {
		return nil, fmt.Errorf("error generating skillmore token: %w", tokenErr)
	}
	org, err := getOrgSkills("7", skillmoreToken)
	if err != nil {
		return nil, fmt.Errorf("error getting org skills: %w", err)
	}
	orgSkills := org.Skills
	var final []StructToResponse
	competitorSkills := make(map[string]map[string]bool)
	for _, competitor := range competitors {
		results, err := getCompetitorSkillsByJobPostings(competitor, accessToken)
		if err != nil {
			return nil, fmt.Errorf("error getting competitor skills for %s: %w", competitor, err)
		}
		for _, skill := range results {
			if _, exists := competitorSkills[skill]; !exists {
				competitorSkills[skill] = make(map[string]bool)
			}
			competitorSkills[skill][competitor] = true
		}
		final = append(final, StructToResponse{Company: competitor, TotalPostings: len(results), TotalSkills: len(results), Skills: results})
	}
	var orgSkillsArray []string
	for _, skill := range orgSkills {
		orgSkillsArray = append(orgSkillsArray, skill.SkillName)
	}
	commonSkills, missingSkills := compareSkills(orgSkillsArray, competitorSkills)
	jsonResponse := JSONResponse{
		OrgId:          7,
		CommonSkills:   commonSkills,
		MissingSkills:  missingSkills,
		Competitors:    competitorSkills,
		OrgSkills:      orgSkillsArray,
		AllCompetitors: final,
	}
	return jsonResponse, nil
}

func RunWithCompetitors(competitors []string) (interface{}, error) {
	return runCompetitorSkillsLogic(competitors)
}

func main() {
	var competitors []string
	if len(os.Args) > 1 {
		competitorsArg := strings.Join(os.Args[1:], " ")
		competitors = strings.Split(competitorsArg, ",")
		for i, comp := range competitors {
			competitors[i] = strings.TrimSpace(comp)
		}
		fmt.Printf("Using custom competitors: %v\n", competitors)
	} else {
		fmt.Println("No competitors provided, using default list")
	}
	var result interface{}
	var err error
	if len(competitors) > 0 {
		result, err = RunWithCompetitors(competitors)
	} else {
		result, err = Run()
	}
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
	jsonData, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error marshaling JSON: %v\n", err)
		os.Exit(1)
	}
	fmt.Println(string(jsonData))
} 