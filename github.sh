#! /bin/bash

# add location of current script because crontab does not run from here
cd /var/www/app/
git pull origin main --ff-only

npm i
