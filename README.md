<h align="center"> EyeGo AI Task </h1>


### Creating Eyego app

<details>
   <summary><h3> Press to see all details </h3></summary>

To create a simple NodeJS web app with an API returning `Hello Eyego`, we can follow this blog [How to create a REST API with Node.js and Express](https://blog.postman.com/how-to-create-a-rest-api-with-node-js-and-express)

```bash
npm init
```
  
- create a js app

  
```bash
touch app.js
```

- Install Dependencies

  
```bash
npm install express
```  
check the API response with postman `https://localhost:3000/eyego`

![](./imgs/API_response_1.png)

- let's print `Hello Eyego`
  - replace `response.send(status);` with `response.send('Hello Eyego');`
  - Terminate the server (<kbd>ctrl + c</kbd>) and run it again (`node app.js`)
  - ![](./imgs/API_response_2.png)


</details>
  
---

### Let's containerize the app

<details>
   <summary><h3> Press to see all details </h3></summary>

I'm gonna use the [official node image](https://hub.docker.com/_/node) from Docker Hub, I'll use the `alpine` image, as it's a very lightweight image

We can pull it with `docker pull node:lts-alpine`, but the Docker engine will download it from the Dockerfile

- build the image with tage
  - ```bash
    docker build -t eyego-app .
    ```
  - we can pull it to Docker Hub, but we need to change the tag based on the docker hub user and repo
    - build a new image `docker build -t  mmsaeed509/eyego-app:v1 .`
    - push to docker hub `docker push mmsaeed509/eyego-app:tagname`
    - here's the [image](https://hub.docker.com/repository/docker/mmsaeed509/eyego-app/general)
    - we can remove from the local system `docker image rm mmsaeed509/eyego-app:v1`

- Let's run the container and test the image 
  
```bash
docker run -p 3000:3000 eyego-app

# Naming Container
 docker run -p 3000:3000 --name EyegoJsApp eyego-app
# detach mode
docker run -p 3000:3000 -d eyego-app

# remove container Automatically when it stopped `--rm`
docker run -p 3000:3000 --rm --name EyegoJsApp eyego-app
```

I'll use `docker run -p 3000:3000 --rm --name EyegoJsApp eyego-app`

![](./imgs/DockerTest.png)

</details>


---

### push the image to Amazon Elastic Container Registry (ECR)

<details>
   <summary><h3> Press to see all details </h3></summary>
</details>


----
<details>
   <summary><h3> Press to see all details </h3></summary>
</details>