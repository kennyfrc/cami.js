#!/bin/bash

set -e
set -u

# Directory containing the examples
examples_dir="examples/partials"

# File containing the base README
readme_base="utils/readme_base.md"

# Temporary file for storing the examples in markdown format
temp_file=$(mktemp)

# Iterate over each HTML file in the examples directory
for file in "$examples_dir"/*.html; do
  # Check if file exists and is readable
  if [[ -r "$file" ]]; then
    # Get the base name of the file, without the directory or extension
    base_name=$(basename "$file" .html)

    # Print the file name and content to the temporary file
    echo "./examples/$base_name.html" >> "$temp_file"
    echo '```html' >> "$temp_file"
    cat "$file" >> "$temp_file"
    echo '```' >> "$temp_file"
    echo "" >> "$temp_file"
  else
    echo "File $file not found or not readable"
  fi
done

# Copy the base README to the final location
cp "$readme_base" "./README.md"

# Replace the placeholder in the README with the content of the temporary file
sed -i '' "/<!-- INSERT EXAMPLES -->/r $temp_file" "./README.md"

# Remove the placeholder
sed -i '' "/<!-- INSERT EXAMPLES -->/d" "./README.md"

# Remove the temporary file
rm "$temp_file"
