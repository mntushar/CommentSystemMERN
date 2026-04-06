provider "aws" {
    region = var.aws_region
}

module "ec2_instance" {
    source = "./ec2_module"
    ami = var.ami
    instance_type = var.instance_type
    name = var.instance_name
    subnet_id = var.subnet_id
}


module "s3_bucket" {
    source = "./s3_module"
    bucket_name = var.bucket_name
    acl = var.acl
    object_ownership = var.object_ownership
}