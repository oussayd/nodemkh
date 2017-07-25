#awk -F';' '{ print $1 ": { CATEGORIE: \"SELECTION " $1 "\", LINK: \"" $2 "\"},"}' newList.txt | sed s/pg_2/pg_{0}/g | sed s/page=2/page={0}/g  |clip
awk   -F';' '
/^$/ {next}
/./ { print $1 "_" $2 ": { CATEGORIE: \"" $2 "\", LINK: \"" $3 "&page={0}\"},"}' newList.txt   | clip