# Clean old files
rm -rf deno
# rm -rf postcss-import

# Clone the repo
# git clone --depth 1 --branch master https://github.com/postcss/postcss-import.git

# Run the script
deno run --unstable --allow-write --allow-read to_deno.js 

# Autoformat the code
deno fmt deno

# Copy md files
# cp postcss/README.md deno/
# cp postcss/CHANGELOG.md deno/
# cp postcss/LICENSE deno/

# Run the tests
cd deno
# deno test --unstable --allow-read test/*