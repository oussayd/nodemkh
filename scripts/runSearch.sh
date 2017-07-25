param="TOP";
if [ "$1" != "" ]; then
  param="$1"
fi

node /d/Dev/Projects/amazonApp/dealSearchV3.js $param 
