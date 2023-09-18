#Generating Responses with GPT-3.5 using OpenAI API
library(officer)
library(httr)
library(openxlsx)
library(tidyverse)
library(reactable)
library(furrr)
library(reticulate)
library(janitor)
py_install("tiktoken")

gpt35_completion_tokens_tracker <- function(system_prompt="", 

                                          user_prompt,

                                          max_tokens = 4000, 

                                          temperature = 0,

                                          engine= "gpt-35-turbo-16K",

                                          freq_penalty = 0, 

                                          presence_penalty = 0, 

                                          top_p = 1, 

                                          stop = NULL) {

  # Pulling relevant environment variables

  api_base <- Sys.getenv("gpt35_api_base")

  deployment_id <- engine

  api_version <- "2023-03-15-preview"

  api_key <- Sys.getenv("gpt35_api_key")


  # Construct the completions URL

  completions_url <- glue::glue(

    "{api_base}/openai/deployments/{deployment_id}/chat/completions?api-version={api_version}"

  )


  # Define the system and user messages

  messages <- list(

    list("role" = "system", "content" = system_prompt),

    list("role" = "user", "content" = user_prompt)

  )


  # Add API key to headers for authorization

  auth <- add_headers(`api-key` = api_key)


  # Define the body of the POST request, including messages and parameters

  body <- list(

    "messages" = messages,

    "max_tokens" = max_tokens,

    "temperature" = temperature,

    "frequency_penalty" = freq_penalty,

    "presence_penalty" = presence_penalty,

    "top_p" = top_p,

    "stop" = stop

  )


  # Send the POST request to OpenAI with retry logic (max 5 attempts, 10 seconds between each retry)

  resp <- httr::RETRY("POST",

                      completions_url,

                      auth,

                      body = body,

                      encode = "json",

                      times = 5, # Maximum number of attempts

                      pause_cap = 10) # Maximum waiting time = 10 seconds


  # Check the status code of the response

  status_code <- resp$status_code


  # Provide descriptive text for the status code

  status_description <- case_when(

    status_code >= 100 & status_code < 200 ~ "Informational: Request received, continuing process.",

    status_code >= 200 & status_code < 300 ~ "Successful: Request received, understood, and accepted.",

    status_code >= 300 & status_code < 400 ~ "Redirection: Further action needs to be taken to complete the request.",

    status_code >= 400 & status_code < 500 ~ "Client Error: The request contains bad syntax or cannot be fulfilled.",

    status_code >= 500 ~ "Server Error: The server failed to fulfill a valid request.",

    TRUE ~ "Unknown status code."

  )


  # Print status code and usage information

  cat("Status Code:", status_description, "\n")


  # Extract and parse the content of the response

  response_content <- content(resp, as = "text", encoding = "UTF-8") %>% 

    jsonlite::fromJSON(flatten = TRUE)


  # Extract the response text

  response_text <- response_content %>% 

    pluck("choices", "message.content")


  cat("Usage:\n")

  print(response_content$usage)

  usage <- response_content$usage$total_tokens


  # Return the response text

  return(list('output'=response_text,

              'usage'=usage))

}

 

gpt35_completion_tokens_tracker(user_prompt="Hello")