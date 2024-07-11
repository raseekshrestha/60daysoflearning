# multi container application

## docker compose

```
version: '3.9'

services:
  backend:
    container_name: backend
    build: .
    ports:
      - 8000:8000
    environment:
      MONGO_URI: mongodb://mongo_db:27017/
      JWT_SECRET: supersecret
    depends_on:
      - mongo_db

  nginx:
    image: nginx:alpine
    container_name: nginx_container
    ports:
      - 80:80
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend

  mongo_db:
    container_name: mongodb_server
    image: mongo:latest
    restart: always
    volumes:
      - type: volume
        source: mongo_db
        target: /data/db

volumes:
  mongo_db: {}

```

## run docker compose in detached mode

```
sudo docker compose up -d
```

## nginx.conf
```
http {
    server {
        listen 80;
        location / {
            proxy_pass http://backend:8000;
            proxy_set_header Host $host;
        }
    }
}

```

## backup mongodb database from the running container
mount volumes to mongo_server
```
volumes:
  - ./backups:/backend/backups

```

take backup on a running container with archive
```
sudo docker exec mongodb_server mongodump --db blogpost --archive=/backend/backups/backup.gzip --gzip
```

without archive
```
sudo docker exec mongodb_server mongodump --db blogpost --out /backend/backups 

```


restore the database

```
sudo docker exec mongodb_server mongorestore --archive=/backend/backups/backup.gzip --gzip
```

or
```
sudo docker exec mongodb_server mongorestore --nsInclude=blogpost /backend/backups/blogpost
```


