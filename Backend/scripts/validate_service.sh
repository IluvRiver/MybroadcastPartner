#!/bin/bash
# Validate the service is running
if pgrep httpd > /dev/null; then
  echo "Service is running"
  exit 0
else
  echo "Service is not running"
  exit 1
fi
