variable "aws_region" {
    default = "ap-southeast-1"
}

variable "ami" {
    default = "ami-08d59269edddde222"
}

variable "instance_type" {
    default = "t3.micro"
}

variable "subnet_id" {
    default = ""
}

variable "instance_name" {
    default = "Terraform-EC2-Instance"
}

variable "bucket_name" {
    default = "my-bucket-terraform-12345678910"
}

variable "acl" {
    default = "private"
}

variable "object_ownership" {
    default = "ObjectWriter"
}