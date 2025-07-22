<h align="center"> EyeGo AI Task </h1>

### Creating Eyego app

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


---

### Let's containerize the app

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

or you can run with docker-compose

```bash
docker-compose up

# or with detached mode
docker-compose up -d

# or
docker compose run eyego-app
```

![](./imgs/DockerTest.png)

---

### push the image to Amazon Elastic Container Registry (ECR)

- Install AWS CLI
- create an IAM, login to console and create IAM user
  - I'll use the `aws-cli` user, that I was created before
  - ![](./imgs/IAM_aws-cli_user.png)
- Login to AWS CLI
  - `aws configure`
  - you can see the config files in `~/.aws`
  - ![](./imgs/aws_configure.png)
  - to know your region
  - ![](./imgs/regions.png)
- create a new ECR repository
  - `aws ecr create-repository --repository-name eyego-app`
  - ![](./imgs/create-repository.png)
  - check the repository from Elastic Container Registry
  - ![](./imgs/ConsoleHome.png)
  - ![](./imgs/repo-1.png)
  - ![](./imgs/repo-2.png)
- Let's push the image to the ECR repository
- from ECR console, select your repository from the list and press on `View push commands`
  - ![](./imgs/select-repo.png)
  - ![](./imgs/push-cmd.png)
  - ![](./imgs/push-cmd-2.png)
  - ![](./imgs/pushed-1.png)
  - ![](./imgs/pushed-2.png)


---

### Deploy the app on AWS EKS & Expose via LoadBalancer/Ingress

Let's the our cluster localy using `minikube`
> YAML k8s files that are used locally can also it used for EKS
> So, you can configure it once and use it for both

- install minikube and run the cluster and open the k8s dashboard

```bash
# Install the cluster on a Docker container
minikube start --driver=docker

# open the k8s dashboard
minikube dashboard
```

- let's deploy the app

```bash
cd k8s
kubectl apply -f .
# or
kubectl apply -f deployment.yaml -f service.yaml
```
![](./imgs/minikube-1.png)


- Expose loadbalancer

```bash
minikube service eyego-service --url
```
![](./imgs/minikube-service.png)

- check `http://192.168.49.2:31081/eyego`

![](./imgs/minikube-service-url.png)

- check using postman

![](./imgs/minikube-service-postman.png)


<!-- 
### 
<details>
   <summary><h3> Press to see all details </h3></summary>
</details> 

-->