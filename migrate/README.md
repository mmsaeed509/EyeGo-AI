<h1 align="center"> Document Migration to GCP </h1>


Let's think about how we can migrate from AWS EKS Setup to GCP GKE.

For the `app.js` and `Dockerfile`, we don't have to change them.

And for the deployment ( `deployment.yaml` and `service.yaml`), we don't have to change them. As I mentioned that the k8s YAML file works on all environments without changing the configuration
> Except if we change the image registry to Google Container Registry (GCR)

> So, here we only change the `image:` in the `deployment.yaml` file

Ok, now we know the 1st thing must change.
> Configure Google Container Registry (GCR)

Let's consider that we successfully updated the Registry to Google Container Registry (GCR). Now, what should change?

We need to update the `.github/workflows/deploy.yml`, and to update it, we should create a cluster in GKE. Also, we need to update the secret

Now, we can summarize the steps to:

- Configure Google Container Registry (GCR)
- Build Docker Image
- Push the Image to GCR
- update the Image in the deployment `deployment.yaml` to pull the image from GCR
- create a GKE cluster
- update the secret
- update `.github/workflows/deploy.yml`
- push and test the deployment

---

### Let's configure GCR and build a new image and push it to GCR, and update `deployment.yaml`

Install `google-cloud-cli` to work with GCP

- configure GCR

```bash
# login
gcloud auth login

# Enable GCR API
gcloud services enable containerregistry.googleapis.com

# Authenticate Docker to use GCR
gcloud auth configure-docker

```

- Build Docker Image

```bash
# selecte the project
gcloud config set project <YOUR_PROJECT_ID>

# build withe tag name
docker build -t gcr.io/<YOUR_PROJECT_ID>/eyego-app:latest .

# Push the Image to GCR
docker push gcr.io/<YOUR_PROJECT_ID>/eyego-app:latest
```

- Update the Image in `deployment.yaml`

```yaml

spec:
  containers:
    - name: eyego-js-app
      image: gcr.io/<YOUR_PROJECT_ID>/eyego-app:latest
      imagePullPolicy: Always
      ports:
        - containerPort: 3000

```


---

### create a GKE cluster

You can create and configure the GKE Cluster using the declarative approach or the imperative approach. But I prefer the declarative one, as it's easy to maintain and update

> see the config in the [gke-cluster.yaml](gke-cluster.yaml)

Enable Required APIs

```bash
gcloud services enable \
  container.googleapis.com \
  containerregistry.googleapis.com \
  cloudresourcemanager.googleapis.com \
  iam.googleapis.com
```

if you got erros install Config Connector to get the full support for declarative approach

```bash
gcloud components install config-connector
```

create the cluster

```bash
kubectl apply -f gke-cluster.yaml
```

update `kubectl`

```bash
gcloud container clusters get-credentials eyego-gke-cluster --zone us-central1-a

```

---

### update the secret

same as same we did for AWS EKS, and her's the env you need:

- `GCP_PROJECT_ID`
- `GKE_CLUSTER`
- `GKE_ZONE`
- `GCP_SA_KEY`

---

### update `.github/workflows/deploy.yml`

1 - update the `env`

```yaml
env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  CLUSTER_NAME: ${{ secrets.GKE_CLUSTER }}
  CLUSTER_ZONE: ${{ secrets.GKE_ZONE }}
  IMAGE: eyego-app
```


2 - update the `Authenticate` and `GCR config`

```yaml
    - name: Authenticate to Google Cloud
      uses: google-github-actions/auth@v2
      with:
        credentials_json: ${{ secrets.GCP_SA_KEY }}

    - name: Configure Docker to use GCR
      run: gcloud auth configure-docker
```

3 - update the `Build` and `Push`

```yaml
    - name: Build and Push Docker Image to GCR
      run: |
        docker build -t gcr.io/$PROJECT_ID/$IMAGE:latest .
        docker push gcr.io/$PROJECT_ID/$IMAGE:latest

    - name: Get GKE Credentials
      uses: google-github-actions/get-gke-credentials@v1
      with:
        cluster_name: ${{ env.CLUSTER_NAME }}
        location: ${{ env.CLUSTER_ZONE }}
```

4 - update the `Deploy to GKE`

```yaml
    - name: Deploy to GKE using kubectl
      run: |
        kubectl apply -f k8s/deployment.yaml
        kubectl apply -f k8s/service.yaml
```

FINIALY, push and test the deploy

---

### Resources:

configure GCR and build a new image and push it to GCR

- [feedbackConfigure authentication to Artifact Registry for Docker](https://cloud.google.com/artifact-registry/docs/docker/authentication)
- [feedbackPush and pull images](https://cloud.google.com/artifact-registry/docs/docker/pushing-and-pulling)

create a GKE cluster

- [feedbackCreating a zonal cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-zonal-cluster)
- [feedbackInstall kubectl and configure cluster access](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl)
- [Creating a GKE Cluster](https://ranchermanager.docs.rancher.com/how-to-guides/new-user-guides/kubernetes-clusters-in-rancher-setup/set-up-clusters-from-hosted-kubernetes-providers/gke)
- [Create a cluster and deploy a workload in the Google Cloud console](https://cloud.google.com/kubernetes-engine/docs/quickstarts/create-cluster)

update `.github/workflows/deploy.yml`

- [Deploying to Google Kubernetes Engine](https://docs.github.com/en/actions/how-tos/managing-workflow-runs-and-deployments/deploying-to-third-party-platforms/deploying-to-google-kubernetes-engine)
- [Setup CI/CD using Github Actions to deploy to Google Kubernetes Engine](https://medium.com/@gravish316/setup-ci-cd-using-github-actions-to-deploy-to-google-kubernetes-engine-ef465a482fd)
