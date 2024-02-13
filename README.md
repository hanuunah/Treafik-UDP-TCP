# Introduction 

This repository contains detailed steps to configure and enable UDP and TCP ports in Traefik Ingress, facilitating traffic from external sources to the cluster through configured ports and protocols. By default, Traefik does not support this functionality, making this project essential for seamless UDP and TCP configuration.


The POC involves researching and implementing how to enable TCP/UDP communication to the pods in the EdgeV2 Kubernetes (k8s) cluster from outside the EdgeV2 host system.

# Prerequisite

- Kubernetes cluster with Treafik ingress
- TCP test app
- UDP test app

# 1. Configuring Traefik for TCP/UDP Port Handling

## Entrypoint
Entrypoint can be simply understood as listening ports, which by identifying which entry point the traffic comes in, traefik would use different routers and then route to different services, there are several predefined entrypoints:

- web — port 8000 (exposed as port 80)
- websecure — port 8443 (exposed as port 443)

We can enable TCP/UDP ports by adding new entry points to Traefik, and there are two ways to achieve this. One is through Helm charts, and the other is by updating the deployment and service YAML files of Traefik to include new entry points and port mappings.

In this Proof of Concept (POC), I have utilized port 8085 for TCP and port 3000 for UDP communication within the EdgeV2 cluster

## New entry point(ports), with helm

To add an additional entry point, with helm, we can see the section in value.yaml having the “ports” key that I have used in one our cluster for testing.

After installing or updating Traefik with the below  Helm values, Traefik will have the following entry points:

- web — port 8000 (exposed as port 80)
- websecure — port 8443 (exposed as port 443)
- tcp8085 — port 8085 (exposed as port 8085)
- udp — port 3000 (exposed as port 3000)

```
additionalArguments:
  - "--accesslog=true"
  - "--accesslog.format=json"
  - "--log.level=DEBUG"

deployment:
  replicas: 1

service:
  spec:
    loadBalancerIP: <loadBalancerIP>
  annotations:
    "service.beta.kubernetes.io/azure-load-balancer-resource-group": "<resource-group>"
ports:    
  tcp8085:
    port: 8085  
    expose: true   
    exposedPort: 8085   
    protocol: TCP
  udp:
    port: 3000  
    expose: true   
    exposedPort: 3000   
    protocol: UDP    

```


## New entry point(ports), with YAML

To add an additional entry point using YAML, you need to update the deployment and service YAML files of Traefik

###  Configuring TCP and UDP Ports in Traefik Deployment YAML

- Updating Args Section to Include TCP/UDP Entry Points
```
    spec:
      containers:
      - args:
        - --global.checknewversion=false
        - --global.sendanonymoususage=false
        - --providers.kubernetesingress
        - --providers.kubernetescrd
        - --entryPoints.http.address=:8000/tcp
        - --entrypoints.udp.address=:3000/udp
        - --entrypoints.tcp8085.address=:8085/tcp
        - --entryPoints.http.forwardedHeaders.insecure
        - --entryPoints.https.address=:8443/tcp
        - --entryPoints.https.forwardedHeaders.insecure
        - --entryPoints.traefik.address=:9000/tcp
        - --api.dashboard=false
        - --ping=true
        - --ping.entryPoint=traefik
        - --log.level=INFO

```

- Updating Ports Section to Include TCP/UDP Entry Points
```
        ports:
        - containerPort: 3000
          name: udp
          protocol: UDP
        - containerPort: 8085
          name: tcp8085
          protocol: TCP
```


### Configuring TCP and UDP Ports in Traefik Service YAML

- Updating Ports Section to Include TCP/UDP Entry Points
```
  ports:
  - name: udp
    nodePort: 30086
    port: 3000
    protocol: UDP
    targetPort: udp
  - name: tcp8085
    nodePort: 30085
    port: 8085
    protocol: TCP
    targetPort: tcp8085

```

# 2. Deploy TCP test app to  cluster

The TCP app that I used for testing is available [here](https://github.com/hanuunah/Treafik-UDP-TCP/blob/main//apps/tcp-listener)  and following are the yamls for deploying the app. Only difference from usual http apps are the ingress route where Traefik has sepaarte CRD for TCP ingress rules


- [Deployment](https://github.com/hanuunah/Treafik-UDP-TCP/blob/main//yamls/tcp-listener/deployment.yaml)
- [Service](https://github.com/hanuunah/Treafik-UDP-TCP/blob/main//yamls/tcp-listener/service.yaml)
- [Ingress](https://github.com/hanuunah/Treafik-UDP-TCP/blob/main//yamls/tcp-listener/ingress.yaml)


# 3. Deploy UDP test app to EdgeV2 cluster

The UDP app that I used for testing is available [here](https://github.com/hanuunah/Treafik-UDP-TCP/blob/main//apps/udp-listener)  and following are the yamls for deploying the app. Only difference from usual http apps are the ingress route where Traefik has sepaarte CRD for UDP ingress rules


- [Deployment](https://github.com/hanuunah/Treafik-UDP-TCP/blob/main//yamls/udp-listener/deployment.yaml)
- [Service](https://github.com/hanuunah/Treafik-UDP-TCP/blob/main//yamls/udp-listener/service.yaml)
- [Ingress](https://github.com/hanuunah/Treafik-UDP-TCP/blob/main//yamls/udp-listener/ingress.yaml)


# Testig urls

- UDP - host:3000
- TCP - host:8085


