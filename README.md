# LearningWebDev

YelpCamp project in web developer bootcamp by colt steel :)

```bash 
npm install
```
change the dot.env to .env and insert the values, if the enviroment variables are not supplied from elsewhere. but use the dot.env as the nameing convention. the DB_URL might be ommitted if the mongo db is hosted locally but if it is hosted for mongo atlas then add the DB connection string. else it should be a part of the dockercompose build.

# developer notes:
```bash 
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
seed the database
```bash 
node seeds/index.js 
```

mongosh CLI in container
```bash 
docker exec -i mdb mongosh
```
