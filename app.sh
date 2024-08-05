#!/bin/bash

# Script for Installing MongoDB, Redis, and Setting up a NestJS Application

# Function to check if a command exists
function command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to update system packages
function update_system() {
    echo "Updating system packages..."
    sudo apt-get update -y
}

# Function to install MongoDB
function install_mongodb() {
    if command_exists mongod; then
        echo "MongoDB is already installed."
    else
        echo "Installing MongoDB..."

        # Import the public key used by the package management system
        wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

        # Create the /etc/apt/sources.list.d/mongodb-org-6.0.list file for Ubuntu 20.04 (Focal)
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

        # Reload local package database
        sudo apt-get update -y

        # Install MongoDB packages
        sudo apt-get install -y mongodb-org

        # Start and enable MongoDB service
        sudo systemctl start mongod
        sudo systemctl enable mongod

        echo "MongoDB installed and started successfully!"
    fi
}

# Function to install Redis
function install_redis() {
    if command_exists redis-server; then
        echo "Redis is already installed."
    else
        echo "Installing Redis..."
        
        # Install Redis server
        sudo apt-get install -y redis-server

        # Start and enable Redis service
        sudo systemctl start redis-server
        sudo systemctl enable redis-server

        echo "Redis installed and started successfully!"
    fi
}

# Function to install Node.js and npm
function install_node() {
    if command_exists node && command_exists npm; then
        echo "Node.js and npm are already installed."
    else
        echo "Installing Node.js and npm..."

        # Use NodeSource to install the latest version of Node.js
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs

        echo "Node.js and npm installed successfully!"
    fi
}

# Function to setup NestJS Application
function setup_nestjs() {
    echo "Setting up NestJS application..."

    # Check if package.json exists in the current directory
    if [[ ! -f package.json ]]; then
        echo "Error: package.json not found in the current directory."
        exit 1
    fi

    # Run npm install
    echo "Running npm install..."
    npm install

    # Build the NestJS application
    echo "Building the NestJS application..."
    npm run build

    # Optionally, run the application
    echo "Starting the NestJS application..."
    npm run start:prod

    echo "NestJS application setup and started successfully!"
}

# Display help message
function display_help() {
    echo "Usage: ./app.sh [function_name]"
    echo "Available functions:"
    echo "  update_system   - Update system packages"
    echo "  install_mongodb - Install MongoDB"
    echo "  install_redis   - Install Redis"
    echo "  install_node    - Install Node.js and npm"
    echo "  setup_nestjs    - Setup NestJS application"
    echo "  help            - Display this help message"
}

# Main script execution
if [[ $# -eq 0 ]]; then
    echo "No function name provided. Use 'help' to see available options."
    exit 1
fi

# Execute the function passed as an argument
case "$1" in
    update_system)
        update_system
        ;;
    install_mongodb)
        install_mongodb
        ;;
    install_redis)
        install_redis
        ;;
    install_node)
        install_node
        ;;
    setup_nestjs)
        setup_nestjs
        ;;
    help)
        display_help
        ;;
    *)
        echo "Invalid function name: $1"
        display_help
        exit 1
        ;;
esac
