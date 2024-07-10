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