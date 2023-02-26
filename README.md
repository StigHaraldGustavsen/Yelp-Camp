# LearningWebDev

YelpCamp project in web developer bootcamp by colt steel :)

```bash 
npm install
```


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
docker run -p 2000:27017 -v webdevcoursemdb:/data/db  --name mdb mongo
```
seed the developer database
```bash 
node seeds/index.js 
```

mongosh CLI in container
```bash 
docker exec -i mdb mongosh
```
