# Docker 

Docker is an open-source platform designed to automate the deployment, scaling, and management of applications using containerization. Containers allow developers to package an application along with its dependencies, libraries, and configuration files into a single, portable unit. This ensures that the application runs consistently across different environments, from a developer's local machine to production.


## Some docker commands

pull image from docker registry

```
sudo docker pull ubuntu:latest

```

run image in interactive mode using
```
sudo docker run -it ubuntu
```

check the running docker container

```
sudo docker ps
```

for stopping running docker container
```
docker stop container_id
```


