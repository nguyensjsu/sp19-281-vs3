
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
