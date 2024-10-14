#!/bin/bash
# Update and install necessary packages
sudo yum update -y
sudo yum install -y httpd

# Create application directory if it does not exist
if [ ! -d /home/ec2-user/LSM ]; then
  mkdir -p /home/ec2-user/LSM
fi

# Clean previous deployment files
rm -rf /home/ec2-user/LSM/*
