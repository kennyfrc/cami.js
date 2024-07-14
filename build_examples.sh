#!/bin/bash
# A script to build the example pages

set -e
set -u

partials_dir="examples/partials"
layout_dir="examples/layouts"

# Remove all old example files
rm -f examples/*.html

count=0
for file in "$partials_dir"/_*.html; do
  if [[ -r "$file" ]]; then
    # Get the base name of the file, without the directory or extension
    base_name=$(basename "$file" .html)

    # Remove the underscore from the base name
    new_name=${base_name#_}

    # Copy the layout file to a new file with the new name
    cp "$layout_dir/layout.html" "examples/$new_name.html"

    # Use sed to replace the placeholder with the content
    sed -i '' -e '/<!-- YIELD -->/r '"$file" -e '/<!-- YIELD -->/d' "examples/$new_name.html"

    # If it's the first iteration, show "Building Documentation..."
    if [[ $count -eq 0 ]]; then
      echo -e "\n📚 Built Examples:"
    fi
    echo " ./examples/$new_name.html"

    count=$((count + 1))
  else
    echo "File $file not found or not readable"
  fi
done
