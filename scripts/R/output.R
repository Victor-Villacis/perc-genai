# write_query_output.R

# Path to the query input file
input_folder <- "/home/victor/perc-genai/server/src/services/query_input"
input_file <- paste0(input_folder, "/query.txt")

# Check if the input file exists
if (!file.exists(input_file)) {
  stop("No query input file found.")
}

# Read the search query from the file
search_query <- readLines(input_file, warn = FALSE)
if (length(search_query) == 0) {
  stop("No search query provided.")
}

# Your existing code for writing to the output folder
output_folder <- "/home/victor/perc-genai/server/src/services/query_output" 

# Simulated output based on the search query (replace this with your actual logic)
# For demonstration, we're just wrapping the search query in an array.
simulated_output <- list(search_query)

# Write the simulated output to a JSON file
json_output_file <- paste0(output_folder, "/gpt_search_out.json")
json_content <- jsonlite::toJSON(simulated_output, auto_unbox = TRUE)
writeLines(json_content, json_output_file)

# Create a '.done' file to signal the server
write("done", file = paste0(output_folder, "/.done"))
