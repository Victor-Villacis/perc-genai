library(officer)
library(httr)
library(openxlsx)
library(tidyverse)
library(reactable)
library(furrr)
library(reticulate)
library(janitor)
py_install("tiktoken")
# source("/mnt/sahil_folder/utils.R")


#pull the input search query

input_query_path <- "/mnt/Data"
user_query <- read_lines(file.path(input_query_path,"query.txt"))

#Generating Responses with GPT-3.5 using OpenAI API
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



#Generating Responses with GPT-3.5 using OpenAI API
gpt35_CoP <- function(
  message_chain,
  max_tokens = 4000, 
  temperature = 0,
  engine= "gpt-35-turbo-16K",
  freq_penalty = 0, 
  presence_penalty = 0, 
  top_p = 0.2, 
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
  # messages <- list(
  #   list("role" = "system", "content" = system_prompt),
  #   list("role" = "user", "content" = user_prompt)
  # )
  
  # Add API key to headers for authorization
  auth <- add_headers(`api-key` = api_key)
  
  # Define the body of the POST request, including messages and parameters
  body <- list(
    "messages" = message_chain,
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
  
  # Print status code and usage information
  cat("Status Code:", status_code, "\n")
  
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




# Function to count the number of tokens in a prompt.
count_tokens <- function(prompt, model="gpt-4") {
  # Import tiktoken, a Python library to count tokens in a text string.
  tiktoken <- import("tiktoken")
  
  # Try to get the token encoding for the given model, use "cl100k_base" as default if the model is not found.
  tryCatch({
    encoding <- tiktoken$encoding_for_model(model)
  }, error=function(e) {
    message("Warning: model not found. Using cl100k_base encoding.")
    encoding <- tiktoken$get_encoding("cl100k_base")
  })
  
  # Encode the prompt and count the number of tokens.
  num_tokens <- length(encoding$encode(prompt))
  return(num_tokens)
}




#Change the path to input doc file
dir_path <- "/mnt/Data/"

# Function to calculate cumulative tokens chunkwise
calculate_cum_tokens_chunk <- function(n_tokens) {
  cum_tokens_chunk <- numeric(length(n_tokens))
  chunk_sum <- 0
  for(i in seq_along(n_tokens)) {
    chunk_sum <- chunk_sum + n_tokens[i]
    if(chunk_sum > 15500) {
      chunk_sum <- n_tokens[i]
    }
    cum_tokens_chunk[i] <- chunk_sum
  }
  return(cum_tokens_chunk)
}



# Find all files in the directory with the pattern "Session.*1.docx"  
docs <- list.files(dir_path, pattern = "1.docx") %>%   
  # Read the files and create a data frame with their summaries  
  map_dfr(~read_docx(paste0(dir_path, .x)) %>%   
            docx_summary()) %>%   
  # Select the columns 'doc_index' and 'text'  
  select(doc_index, text) %>%   
  # Clean up the text by removing extra white spaces  
  mutate(text = text %>%   
           # Replace names with initials (commented out)  
           # str_replace_all(c("Ashley P" = "Ash P", "Ashley" = "Ash")) %>%   
           str_squish()) %>%   
  # Remove rows with empty text  
  filter(text != "") %>%   
  # Extract the speaker and initials from the text  
  mutate(speaker = text %>% str_extract("^[^:]+"),  
         initials = speaker %>% str_replace("\\b([A-Z])[:alpha:]+?\\s+?([A-Z])", "\\1\\2"),  
         # Extract the session number from the text  
         session = text %>%   
           str_extract("Ses.+?[0-9]")) %>%    
  # Fill missing session values with the previous or next available value  
  fill(session, .direction = "downup") %>%   
  # Extract the section from the text and clean it  
  mutate(section = text %>% str_extract("\\/\\/.+?\\/\\/") %>% str_remove_all("//")) %>%   
  # Fill missing section values with the previous available value  
  fill(section, .direction = "down") %>%   
  # Remove rows with missing section values  
  filter(!is.na(section)) %>%   
  # Combine text by section  
  summarise(text = paste(text, collapse = "\n"), .by = section) %>%   
  # Count the number of tokens in each text  
  mutate(n_tokens = text %>% map_int(count_tokens)) %>%   
  # Calculate the cumulative sum of tokens  
  mutate(cum_tokens = cumsum(n_tokens)) %>%   
  # Assign a unique section number to each row  
  mutate(section_num = row_number()) %>%   
  # Calculate the cumulative tokens chunk  
  mutate(cum_tokens_chunk = calculate_cum_tokens_chunk(n_tokens)) %>%   
  # Assign a chunk ID based on the cumulative tokens chunk  
  mutate(chunk_id = as.numeric(cum_tokens_chunk < lag(cum_tokens_chunk, default = 0)) %>% cumsum()+1) %>%   
  # summarise the data by chunk_id  
  summarise(text=paste(text,collapse = "\n[END OF THIS CHUNK]\n"),.by = chunk_id)


#Deafult system prompt
default_system_prompt <- 'You are an AI assistant that helps people find information'


#Prompts for chunked data
chunk_system_prompt <-   
  "You are an AI assistant that extracts detailed answers exclusively from a specific chunk of a patient engagement conversation transcript. Analyze and extract detailed answers from the patients' responses to the given question using only the available information in the transcript. Do NOT mention any patient names in the response. You could possibly use initials though. If the answer is not found in the transcript, respond with 'Not Found'."  



chunk_user_prompt <- function (user_query,context) {
  
  glue::glue('Answer the question with explanation based on the context below and if the question cannot be answered based on the context, say "Not found". Address people with their full names.

Context : {context}

Question: {user_query}


')
}




# Run GPT on chunked data
docs <- docs %>% 
  mutate(gpt_response = text %>% map_chr(~gpt35_completion_tokens_tracker(
    system_prompt =default_system_prompt,
    user_prompt = chunk_user_prompt(user_query = user_query,context  = .x),
    temperature = 0,
    top_p = 0.20) %>% pluck("output")))


docs$gpt_response

# Prompts for combining chunk responses

final_system_prompt <- 'You are an AI assistant that helps to find the best and most detailed answer from the given responses to a specific question. Each response is based on a different chunk of a patient engagement conversation transcript using only the available information. Review the responses below and provide a single best and detailed answer. Do NOT mention any patient names in the response. You could possibly use initials though. If all responses say "Not Found," respond with "Answer not found in the transcript."'


final_user_prompt <- function(user_query, responses) {          
  glue::glue('        

Your task is to refine the concatenated responses to a question from different parts of a patient engagement conversation. Merge these responses to provide the best and most detailed single cohesive answer.

RESPONSES:
{responses}

QUESTION:
{user_query}

Organize your response in a clear and structured manner, and be concise. Focus on synthesizing the information to provide a comprehensive answer. If there are conflicting or contradictory responses, consider analyzing the context and providing a balanced and nuanced answer.
If any response says "not found", it means that the answer is not found in that particular chunk. If all responses say "Not Found," respond with "Answer not found in the transcript." Replace names with their initials. For example, Alex F should be replaced with AF.

Remove any phrases such as "based on provided information" if present.



')        
}    




# Concatenate the responses from all the chunks
final_responses <- docs %>% 
  glue::glue_data("Response from chunk {chunk_id}:{gpt_response}") %>% 
  paste(collapse = '\n\n')


final_gpt_response <- 
  gpt35_completion_tokens_tracker(system_prompt = default_system_prompt,
                                  user_prompt = final_user_prompt(user_query,final_responses),
                                  temperature = 0,
                                  top_p = 0.2) %>% 
  pluck("output")


# Define the system and user messages
messages <- list(
  list("role" = "system", "content" = default_system_prompt),
  list("role" = "user", "content" = final_system_prompt),
  list("role" = "assistant", "content" = final_gpt_response),
  list("role" = "user", "content" = "Please replace names with initials" )
)


refined_gpt_response <- gpt35_CoP(message_chain = messages)

refined_gpt_response$output %>% 
  jsonlite::toJSON() %>% 
  writeLines("gpt_search_out.json")
  write("done", "query_output/.done")