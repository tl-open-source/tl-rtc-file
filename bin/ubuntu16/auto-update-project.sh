#!/bin/bash
#########################
# 提供一键更新项目代码版本的脚本
# @auther: iamtsm
# @version: v1.0.0
#########################

# Check if the current directory is a Git repository
if [ -d .git ]; then
    # The current directory is a Git repository, so we can pull the latest changes
    echo "Current directory is a Git repository. Pulling latest changes..."
    git pull
else
    # The current directory is not a Git repository
    echo "Current directory is not a Git repository."

    # Check if Git is installed
    if ! command -v git &> /dev/null; then
        # Git is not installed, so let's try to install it
        echo "Git is not installed. Installing Git..."
        sudo apt-get update
        sudo apt-get install -y git  # Adjust this for CentOS or other Linux distributions
    fi

    # Initialize a new Git repository and set the remote URL
    echo "Initializing a new Git repository and setting remote URL..."
    git init
    git remote add origin https://github.com/tl-open-source/tl-rtc-file.git

    # Pull the latest changes from the remote repository (use 'master' branch)
    git pull origin master

    # Optionally, you can set the default branch to 'master'
    git symbolic-ref refs/remotes/origin/HEAD refs/remotes/origin/master
fi

echo "Done."