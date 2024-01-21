# CNAT Web App
This microservice is the front end of the application. It provides an intuitive way of managing 
and displaying trackers and trackers data for the user.

The Web App itself only deals with creating and displaying the UI. When the application loads 
on the web browser, it populates dynamic data by making REST API calls to the API Gateway.
The Web App is served on the same origin as the API Gateway.

## Deployment

- Using NPM:

  ```bash
  npm start
  ```

- Using Docker:

  ```bash
  docker build -t cnat-web-app .
  docker run --name some-cnat-web-app -dp 80:80 \
    cnat-web-app
  ```

- Using Kubernetes:

  First create the Docker image, then run:
  ```bash
  kubectl -f apply k8s/k8s-cnat-web-app.yaml
  ```
