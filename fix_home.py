import os
import re

file_path = "d:/mindlab/medinfolab.com/src/components/home-page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# We need to remove the Team Section
# It starts with {/* Team Section */} and ends right before the <section className="container-wide pb-24 sm:pb-28">
# Let's use regex
content = re.sub(r'\{/\*\s*Team Section\s*\*/\}.*?(?=<section className="container-wide pb-24 sm:pb-28">)', '', content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
