# Yelp-camp

YelpCamp project in web developer bootcamp by colt steel :) added some extras tho, like getting Geodata from device and dockerized the application.

change the dot.env to .env and insert the values, if the enviroment variables are not supplied from elsewhere. but use the dot.env as the nameing convention.  

```bash 
docker compose up -d
```
the DB_URL is gotten from the docker compose file, but if it not run with docker compose, the DB_URL might be ommitted if the mongo db is hosted locally but if it is hosted for mongo atlas then add the DB connection string. else it should be a part of the dockercompose build.

# developer notes:
```bash 
npm install
npm install -g nodemon
```

run node app
```bash 
nodemon -L app.js
```
## mongodb

developer notes - running localc mongodb in docker
```bash 
docker run -d -p 2000:27017 -v webdevcoursemdb:/data/db  --name mdb mongo
```
seed the dev database use; DEV_USER, DEV_USER_EMAIL and DEV_PASSWORD enviroment variables for the dev user in the dev db.
```bash 
node seeds/index.js 
```
the database connection url can be added as an argument to the seeds/index.js
```bash 
node seeds/index.js mongodb://database/yelp-camp
```



mongosh CLI in container
```bash 
docker exec -i mdb mongosh
```
