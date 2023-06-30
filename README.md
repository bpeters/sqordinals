# sqordinals
on chain ordinal gen art

npm install -g html-minifier uglify-js

uglifyjs sqord.js -o sqord.min.js

copy sqord.min.js into index.html

html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true index.html -o index.min.html


# LIST OF GOOD INPUTS
