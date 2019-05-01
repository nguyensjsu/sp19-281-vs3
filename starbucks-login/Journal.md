
###MongoDB Sharding : 

**Launch EC2 Free-Tier Instance**
- AMI: Amazon Linux AMI
- Type: t2.micro
- VPC: cmpe281
- Subnet: Private
- Auto Assigned Public IP: Disabled
- Create new SG: mongo
- Open Ports: 22, 27017, 27018, 27019
- Key Pair: cmpe281-us-west-1

**Install mongo :**

**Configure the package management system (yum).**
Create a /etc/yum.repos.d/mongodb-org-4.0.repo file so that you can install MongoDB directly using yum:

       [mongodb-org-4.0]
        name=MongoDB Repository
        baseurl=https://repo.mongodb.org/yum/amazon/2013.03/mongodb-org/4.0/x86_64/
        gpgcheck=1
        enabled=1
        gpgkey=https://www.mongodb.org/static/pgp/server-4.0.asc
        
Install the mogodb packages

        sudo yum install -y mongodb-org
        sudo yum install -y mongodb-org-4.0.7 mongodb-org-server-4.0.7 mongodb-org-shell-4.0.7 mongodb-org-mongos-4                  mongodb-org-tools-4.0.7
        sudo chkconfig mongod on
        sudo mkdir -p /data/db
        sudo chown -R mongod:mongod /data/db
	
![Alt Text](https://github.com/nguyensjsu/sp19-281-vs3/blob/master/starbucks-login/Screenshots/shardupload.jpeg)


The sharded database setup looks like this -

The config servers :
![](https://github.com/nguyensjsu/sp19-281-vs3/blob/master/starbucks-login/Screenshots/GroupProjectSS01.png)

The data shards : 
The top row in the Screeshot shows shard 01 and the lower row are the two nodes of shard 02. 

![](https://github.com/nguyensjsu/sp19-281-vs3/blob/master/starbucks-login/Screenshots/GroupProjectSS02.png)

The Query router mongos :
![](https://github.com/nguyensjsu/sp19-281-vs3/blob/master/starbucks-login/Screenshots/GroupProjectSS03.png)


Step 2 :
 Get the API running , locally tested with mongo container running on docker test results -
 
 1. Signup - 
 ![](https://github.com/nguyensjsu/sp19-281-vs3/blob/master/starbucks-login/Screenshots/Signuplocally.png)
 
 Mongo container 
 ![](https://github.com/nguyensjsu/sp19-281-vs3/blob/master/starbucks-login/Screenshots/containermongo.png)
 
 2. login -
 ![](https://github.com/nguyensjsu/sp19-281-vs3/blob/master/starbucks-login/Screenshots/login.png)
 
 3. logout -
 ![](https://github.com/nguyensjsu/sp19-281-vs3/blob/master/starbucks-login/Screenshots/logoutLocally.png)
 
 4. ping -
 ![](https://github.com/nguyensjsu/sp19-281-vs3/blob/master/starbucks-login/Screenshots/APIping.png)
 
 
 After locally testing the API, next step is to deployed on to the cloud. The API has been set up on a docker container on an EC2 instance while the sharded database is in the subnet. 
 When tested from outside, the following results are obtained.
 
 1. Signing up a new user
 ![](https://github.com/nguyensjsu/sp19-281-vs3/blob/master/starbucks-login/Screenshots/curlCommandToCodeInstance.png)
 
 2. How the sharded database looks like -
 ![](https://github.com/nguyensjsu/sp19-281-vs3/blob/master/starbucks-login/Screenshots/shardFInalsetup.png)
 In the Screenshot above , the data inserted is being routed to the data shards and the data is stored based on the shard key.
 
 3. User logging off and logging in 
 ![](https://github.com/nguyensjsu/sp19-281-vs3/blob/master/starbucks-login/Screenshots/Screenshot%20from%202019-04-25%2001-38-39.png)
