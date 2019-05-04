# CMPE281 - Team Hackathon Project

## Team: VS3

## Team Members:

- [Sojan Mathew](https://github.com/sojanmatt)
- [Surabhi Sinha](https://github.com/surabhisinha31)
- [Shubham Shrivastava](https://github.com/shrivastavshubham34)
- [Vaishali Koul](https://github.com/Vaishalik07)

## Architecture Diagram

![architecture](https://user-images.githubusercontent.com/13406071/57175261-7dba6880-6dfe-11e9-9b3e-cccc85999057.png)

## Description

### 1. Frontend

`Technology Stack:` HTML, CSS, React, Redux
The frontend user will log in and the further corresponding requests will be cascaded to the appropriate API via Kong Gateway.

### 2. Kong API Gateway

The ```Kong API Gateway``` is used to route the APIs to the corresponding elastic load balancer.

### 3. Load Balancers

There are 5 ```load balancers``` - each for the Go APIs to scale the application horizontally.

### 4. Go APIs

Login API service is used to add/update/delete a user from the datastore.
Menu API service is used to display inventory from the database.
Cart API service is used to add/update/delete items from a cart.
Payments API service is used to process the payments made.

### 5.  Mongo DB Sharded cluster

We have two mongoDB sharded clusters, one for Menu API and other for Login API. These mongo db sharded cluster consists of a replica set of 2 config server nodes, 2 shard servers with 1 node each and 1 mongos instance as a query router. 

### 6. Riak Cluster

The riak cluster consists of 5 nodes across Oregon and North Virginia region.

## AKF Scale Cube

### X-axis Scaling:

Horizontal duplication or x-axis scaling is to create multiple instances or clones of your application on AWS managed by a load balancer.

This has been implemented by cloning our APIs and using a load balancer.

### Y-axis Scaling:

Y axis scaling or functional decomposition is to separate services or dissimilar things.

This has been implemented by creating four different microservices(Shared Noting Architecture) 

### Z-axis Scaling:

Z axis scaling is data split .

This has been implemented by using a mongodb sharded cluster to store user data

## Network Partition

Riak cluster has been created with 5 nodes. 

We have setup Riak Nodes across different regions. On every client request, response is forwarded to load balancer for both the regions which makes sure load is distributed evenly. This also helps us maintain high availability of our system and makes it partition tolerant since in case any of the riak nodes stops responding, our system will still get a response from the other cloned nodes in another region.

## Creativity in the use and application of topics and tools discussed in class

-We have deployed our front end on Heroku.
-We have used kong as our microservice API gateway.
-All our microservices are deployed using docker on AWS machines. Each API is running on 2 AWS machines behind load balancers.
-Deployed the Payments service on EKS cluster.
-Deployed Inter-region Cart service using Route 53.
-All microservices run independently of each other and are developed using GoLang.
-At the database level, we are using a mongodb sharded cluster and a highly-available riak cluster

## Architecture Diagrams

### Login API
![UsersArchitecture](https://user-images.githubusercontent.com/13406071/57174572-c6215880-6df5-11e9-9616-d4b59374c3e4.png)

### Menu API
![Menu](https://user-images.githubusercontent.com/13406071/57174602-2e703a00-6df6-11e9-8f41-c185c8bacb38.png)

### Cart API
![CART-SERVICE-ARCHITECTURE](https://user-images.githubusercontent.com/13406071/57174389-f1567880-6df2-11e9-953d-ba41b9182303.png)

### Payments API
![image](https://user-images.githubusercontent.com/42900784/57173318-ae8ca480-6de2-11e9-8722-6f1daead1aff.png)

## Screenshots

Login

![login](https://user-images.githubusercontent.com/13406071/57174907-6e392080-6dfa-11e9-9775-bd874fc1a880.jpeg)

Menu

![menu](https://user-images.githubusercontent.com/13406071/57174923-78f3b580-6dfa-11e9-86e7-a0774b5f8a52.jpeg)

Cart

![cart](https://user-images.githubusercontent.com/13406071/57174926-8ad55880-6dfa-11e9-8b80-816edfeb5566.jpeg)

Payment

![payment-successfull](https://user-images.githubusercontent.com/13406071/57174928-9759b100-6dfa-11e9-92c7-13be2ac4a7e7.jpeg)

Order List

![order-list](https://user-images.githubusercontent.com/13406071/57174934-a50f3680-6dfa-11e9-9570-8ee937f9ff61.jpeg)
