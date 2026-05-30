package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
)

type ChatGPTRequest struct {
    Model     string                 `json:"model"`
    Messages  []map[string]string    `json:"messages"`
    MaxTokens int                    `json:"max_tokens"`
}

type Job struct {
    JobTitle       string `json:"jobTitle"`
    JobDescription string `json:"jobDescription"`
}

type ChatGPTResponse struct {
    Choices []struct {
        Message struct {
            Content string `json:"content"`
        } `json:"message"`
    } `json:"choices"`
}

// Function to get a potential future job title from ChatGPT
func generateFutureJobTitles(apiKey, orgID, jobTitle, jobDescription string) (interface{}, error) {
    url := "https://api.openai.com/v1/chat/completions"

    // Create the request payload
    requestPayload := ChatGPTRequest{
        Model: "gpt-3.5-turbo",
        Messages: []map[string]string{
            {
                "role": "user",
                "content": fmt.Sprintf(
                    "Given the job title \"%s\" and the job description \"%s\", suggest one potential future job title that would be the best fit. Just return the job title as plain text.",
                    jobTitle, jobDescription,
                ),
            },
        },
        MaxTokens: 50,
    }

    // Convert request payload to JSON
    requestBody, err := json.Marshal(requestPayload)
    if err != nil {
        return nil, fmt.Errorf("failed to marshal request payload: %v", err)
    }

    // Create HTTP request
    req, err := http.NewRequest("POST", url, bytes.NewBuffer(requestBody))
    if err != nil {
        return nil, fmt.Errorf("failed to create request: %v", err)
    }
    req.Header.Set("Authorization", "Bearer "+apiKey)
    req.Header.Set("OpenAI-Organization", orgID) // Add organization ID header
    req.Header.Set("Content-Type", "application/json")

    // Perform HTTP request
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, fmt.Errorf("request failed: %v", err)
    }
    defer resp.Body.Close()

    // Read and process response
    responseBody, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return nil, fmt.Errorf("failed to read response body: %v", err)
    }

    var chatGPTResponse ChatGPTResponse
    if err := json.Unmarshal(responseBody, &chatGPTResponse); err != nil {
        return nil, fmt.Errorf("failed to unmarshal response: %v", err)
    }

    if len(chatGPTResponse.Choices) > 0 && chatGPTResponse.Choices[0].Message.Content != "" {
        content := chatGPTResponse.Choices[0].Message.Content

        // return []Job{
        //     {
        //         JobTitle:       content,
        //         JobDescription: jobDescription,
        //     },
        // }, nil
        return content, nil
    }

    return nil, fmt.Errorf("no valid content found in response")
}
