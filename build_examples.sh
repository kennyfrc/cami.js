#!/bin/bash
# A ridiculous script to build the example pages

set -e
set -u

# Directory containing the partials
partials_dir="examples/partials"

# Directory containing the layout
layout_dir="examples/layouts"

# Placeholder for newline characters
newline_placeholder="NEWLINE_PLACEHOLDER"

# Remove all old example files
rm -f examples/*.html

count=0
# Iterate over each file in the partials directory
for file in "$partials_dir"/_*.html; do
  # Check if file exists and is readable
  if [[ -r "$file" ]]; then
    # Read the content of the file, replacing newline characters with the placeholder
    content=$(cat "$file" | tr '\n' '\r' | sed "s/\r/$newline_placeholder/g")

    # Escape special characters in the content
    content=$(echo "$content" | sed -e 's/[\/&]/\\&/g')

    # Check if content was read successfully
    if [[ $? -ne 0 ]]; then
      echo "Error reading file $file"
      continue
    fi

    # Get the base name of the file, without the directory or extension
    base_name=$(basename "$file" .html)

    # Remove the underscore from the base name
    new_name=${base_name#_}

    # Copy the layout file to a new file with the new name
    cp "$layout_dir/layout.html" "examples/$new_name.html"

    # Check if copy was successful
    if [[ $? -ne 0 ]]; then
      echo "Error copying layout to examples/$new_name.html"
      continue
    fi

    # Replace the placeholder with the content, then replace the newline placeholder with actual newline characters
    escaped_content=$(printf '%q' "$content")
    sed -i '' "s#<!-- YIELD -->#$content#g" "examples/$new_name.html"
    sed -i '' "s/$newline_placeholder/\\
/g" "examples/$new_name.html"

    # Check if sed command was successful
    if [[ $? -ne 0 ]]; then
      echo "Error replacing placeholder in $new_name.html"
      continue
    fi

    # If it's the first iteration, show "Building Documentation..."
    if [[ $count -eq 0 ]]; then
      echo "\n📚 Built Examples:"
    fi
    echo " ./examples/$new_name.html"

    count=$((count + 1))
  else
    echo "File $file not found or not readable"
  fi
done
