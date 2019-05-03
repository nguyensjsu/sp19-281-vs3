# Create your Amazon EKS Service Role

## To create your Amazon EKS service role in the IAM console

- Open the IAM console at https://console.aws.amazon.com/iam/.

Choose Roles, then Create role.

Choose EKS from the list of services, then Allows Amazon EKS to manage your clusters on your behalf for your use case, then Next: Permissions.

Choose Next: Tags.

(Optional) Add metadata to the role by attaching tags as key–value pairs. For more information about using tags in IAM, see Tagging IAM Entities in the IAM User Guide.

Choose Next: Review.

For Role name, enter a unique name for your role, such as eksServiceRole, then choose Create role.

![image](https://user-images.githubusercontent.com/42900784/57168753-0f52b780-6db8-11e9-963f-a3e7310da26a.png)


Create User 


![image](https://user-images.githubusercontent.com/42900784/57168727-e3cfcd00-6db7-11e9-99b0-43199a5a1933.png)


## Create your Amazon EKS Cluster VPC

To create your cluster VPC

Open the AWS CloudFormation console at https://console.aws.amazon.com/cloudformation.

From the navigation bar, select a Region that supports Amazon EKS.

Choose Create stack.

For Choose a template, select Specify an Amazon S3 template URL.

Paste the following URL into the text area and choose Next:

	https://amazon-eks.s3-us-west-2.amazonaws.com/cloudformation/2019-02-11/amazon-eks-vpc-sample.yaml
	
### Stack
![image](https://user-images.githubusercontent.com/42900784/57169092-a4a27b80-6db9-11e9-9200-f4229bf2467d.png)


### Node Stack
![image](https://user-images.githubusercontent.com/42900784/57169105-ba17a580-6db9-11e9-89f6-99189b2150a4.png)

## Create Your Amazon EKS Cluster

To create your cluster with the console

Open the Amazon EKS console at https://console.aws.amazon.com/eks/home#/clusters.

Choose Create cluster.

Note

If your IAM user does not have administrative privileges, you must explicitly add permissions for that user to call the Amazon EKS API operations. For more information, see Creating Amazon EKS IAM Policies.

On the Create cluster page, fill in the following fields and then choose Create:

Cluster name: A unique name for your cluster.

Kubernetes version: The version of Kubernetes to use for your cluster. By default, the latest available version is selected.

Role ARN: Select the IAM role that you created with Create your Amazon EKS Service Role.

VPC: The VPC you created with Create your Amazon EKS Cluster VPC. You can find the name of your VPC in the drop-down list.

Subnets: The SubnetIds values (comma-separated) from the AWS CloudFormation output that you generated with Create your Amazon EKS Cluster VPC. By default, the available subnets in the above VPC are preselected.

Security Groups: The SecurityGroups value from the AWS CloudFormation output that you generated with Create your Amazon EKS Cluster VPC. This security group has ControlPlaneSecurityGroup in the drop-down name.

Important

The worker node AWS CloudFormation template modifies the security group that you specify here, so Amazon EKS strongly recommends that you use a dedicated security group for each cluster control plane (one per cluster). If this security group is shared with other resources, you might block or disrupt connections to those resources.

Endpoint private access: Choose whether to enable or disable private access for your cluster's Kubernetes API server endpoint. If you enable private access, Kubernetes API requests that originate from within your cluster's VPC will use the private VPC endpoint. For more information, see Amazon EKS Cluster Endpoint Access Control.

Endpoint public access: Choose whether to enable or disable public access for your cluster's Kubernetes API server endpoint. If you disable public access, your cluster's Kubernetes API server can only receive requests from within the cluster VPC. For more information, see Amazon EKS Cluster Endpoint Access Control.

Logging – For each individual log type, choose whether the log type should be Enabled or Disabled. By default, each log type is Disabled. For more information, see Amazon EKS Control Plane Logging

Note

You might receive an error that one of the Availability Zones in your request doesn't have sufficient capacity to create an Amazon EKS cluster. If this happens, the error output contains the Availability Zones that can support a new cluster. Retry creating your cluster with at least two subnets that are located in the supported Availability Zones for your account. For more information, see Insufficient Capacity.

On the Clusters page, choose the name of your newly created cluster to view the cluster information.

The Status field shows CREATING until the cluster provisioning process completes. Cluster provisioning usually takes between 10 and 15 minutes.
### Amazon EKS Cluster

![image](https://user-images.githubusercontent.com/42900784/57169134-e3383600-6db9-11e9-85d4-38cee329dd82.png)


### Install and Configure kubectl for Amazon EKS


## Launch and Configure Amazon EKS Worker Nodes

To launch your worker nodes

Wait for your cluster status to show as ACTIVE. If you launch your worker nodes before the cluster is active, the worker nodes will fail to register with the cluster and you will have to relaunch them.

Open the AWS CloudFormation console at https://console.aws.amazon.com/cloudformation.

From the navigation bar, select a Region that supports Amazon EKS.

Choose Create stack.

For Choose a template, select Specify an Amazon S3 template URL.

Paste the following URL into the text area and choose Next:

https://amazon-eks.s3-us-west-2.amazonaws.com/cloudformation/2019-02-11/amazon-eks-nodegroup.yaml
On the Specify Details page, fill out the following parameters accordingly, and choose Next.

Stack name: Choose a stack name for your AWS CloudFormation stack. For example, you can call it <cluster-name>-worker-nodes.

ClusterName: Enter the name that you used when you created your Amazon EKS cluster.

Important

This name must exactly match the name you used in Step 1: Create Your Amazon EKS Cluster; otherwise, your worker nodes cannot join the cluster.

ClusterControlPlaneSecurityGroup: Choose the SecurityGroups value from the AWS CloudFormation output that you generated with Create your Amazon EKS Cluster VPC.

NodeGroupName: Enter a name for your node group. This name can be used later to identify the Auto Scaling node group that is created for your worker nodes.

NodeAutoScalingGroupMinSize: Enter the minimum number of nodes that your worker node Auto Scaling group can scale in to.

NodeAutoScalingGroupDesiredCapacity: Enter the desired number of nodes to scale to when your stack is created.

NodeAutoScalingGroupMaxSize: Enter the maximum number of nodes that your worker node Auto Scaling group can scale out to.

NodeInstanceType: Choose an instance type for your worker nodes.

Important

Some instance types might not be available in all regions.

NodeImageId: Enter the current Amazon EKS worker node AMI ID for your Region. The AMI IDs for the latest Amazon EKS-optimized AMI (with and without GPU support) are shown in the following table.

Note

The Amazon EKS-optimized AMI with GPU support only supports P2 and P3 instance types. Be sure to specify these instance types in your worker node AWS CloudFormation template. By using the Amazon EKS-optimized AMI with GPU support, you agree to NVIDIA's end user license agreement (EULA).

On the Options page, you can choose to tag your stack resources. Choose Next.

On the Review page, review your information, acknowledge that the stack might create IAM resources, and then choose Create.

When your stack has finished creating, select it in the console and choose the Outputs tab.

Record the NodeInstanceRole for the node group that was created. You need this when you configure your Amazon EKS worker nodes.

## To enable worker nodes to join your cluster

Download, edit, and apply the AWS authenticator configuration map:

Download the configuration map with the following command:

	curl -o aws-auth-cm.yaml https://amazon-eks.s3-us-west-2.amazonaws.com/cloudformation/2019-02-11/aws-auth-cm.yaml
	
	
 Replace the <ARN of instance role (not instance profile)> snippet with the NodeInstanceRole value that you recorded in the previous procedure, and save the file.

Important

Do not modify any other lines in this file.

apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-auth
  namespace: kube-system
data:
  mapRoles: |
    - rolearn: <ARN of instance role (not instance profile)>
      username: system:node:{{EC2PrivateDNSName}}
      groups:
        - system:bootstrappers
        - system:nodes
Apply the configuration. This command might take a few minutes to finish.

![image](https://user-images.githubusercontent.com/42900784/57169548-3c08ce00-6dbc-11e9-9c26-f5cb24cbe79d.png)

kubectl apply -f aws-auth-cm.yaml
Note

If you receive the error "aws-iam-authenticator": executable file not found in $PATH, your kubectl isn't configured for Amazon EKS. For more information, see Installing aws-iam-authenticator.

If you receive any other authorization or resource type errors, see Unauthorized or Access Denied (kubectl) in the troubleshooting section.

## Worker nodes(Ec2)

![image](https://user-images.githubusercontent.com/42900784/57169659-e41e9700-6dbc-11e9-9f2c-752ac849199f.png)


Watch the status of your nodes and wait for them to reach the Ready status.

	kubectl get nodes --watch
	
(GPU workers only) If you chose a P2 or P3 instance type and the Amazon EKS-optimized AMI with GPU support, you must apply the NVIDIA device plugin for Kubernetes as a daemon set on your cluster with the following command.




![image](https://user-images.githubusercontent.com/42900784/57169607-9c980b00-6dbc-11e9-8509-51402af8df45.png)


![image](https://user-images.githubusercontent.com/42900784/57169172-17abf200-6dba-11e9-92cb-65ea3dba2e95.png)

