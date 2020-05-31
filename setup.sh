#!/bin/bash

INSTALL_DIRECTORY=/opt/LanFlix
SENDER_CONFIG=$INSTALL_DIRECTORY/config

if [ ! -d "$INSTALL_DIRECTORY" ]; then
  sudo mkdir -p $INSTALL_DIRECTORY
fi

# Setup the sender.json
if [ ! -d "$SENDER_CONFIG" ]; then
  echo Setting up sender config file...
  setup_sender=1
else
  echo Sender config is already setup, would you like to reset it? \(y/n\)
  read reset
  if [[ "$reset" = "y" ]]; then
    setup_sender=1
  fi
fi

if [ $setup_sender ]; then
  echo -n Enter the name of the sender \(default: Plex Server\):
  read name
  if [ ! $name ]; then
    name="Plex Server"
  fi
  echo -n Enter the email to send notifications from:
  read email
  if [[ ! $email =~ .+@.+ ]]; then
    echo Error: Invalid email!
    exit -1
  fi
  echo -n Password:
  read -s password
fi

if [ ! -d "$SENDER_CONFIG" ]; then
  sudo mkdir -p $SENDER_CONFIG
fi

echo { \
  \"name\": \"$name\", \
  \"email\": \"$email\", \
  \"password\": \"$password\" \
} | sudo dd of=$SENDER_CONFIG/sender.json &> /dev/null

# Setup node
node_version=$(node -v)
if [[ ! $node_version =~ v12..* ]]; then
  sudo apt update
  sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
  curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
  sudo apt -y install nodejs
fi

# Setup the notifier
install_version=$(node -p -e "require('$INSTALL_DIRECTORY/package.json').version")
current_version=$(node -p -e "require('./package.json').version")

if [[ ! $install_version == $current_version ]]; then
  npm install
  sudo cp -r src $INSTALL_DIRECTORY
  sudo cp -r node_modules $INSTALL_DIRECTORY
  sudo cp package.json $INSTALL_DIRECTORY
else
  echo Notifier up to date!
fi

# Login with firebase? https://firebase.google.com/docs/cli/
sudo npm install -g firebase-tools
firebase login:ci
firebase init firestore

# Create database template
# Use the notifier libraries to read and write the template

# Setup the systemctl process

# Check if sonarr is installed, set script there?
# Check if radarr is installed, set script there?
