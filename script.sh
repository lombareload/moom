sudo apt-get update
sudo apt-get install -y build-essential
sudo apt-get install -y git
echo 'INSTALLING AS USER = '$(whoami)
NVM_PRESENT=$(grep NVM_DIR $HOME/.bashrc)
if [ -z "$NVM_PRESENT" ]; then
    echo 'DOWNLOADING NVM'
    curl -s https://raw.githubusercontent.com/creationix/nvm/v0.24.1/install.sh | bash
    if [ $? -eq 0 ]; then
        source ~/.nvm/nvm.sh
    else
        echo 'UNABLE TO INSTALL NVM CHECK YOUR INTERNET CONNECTIVITY AN RUN "vagrant reload --provision"'
        exit 1
    fi
else
    echo 'NVM ALREADY INSTALLED'
    source ~/.nvm/nvm.sh
fi

NODEJS_PRESENT=$(grep 'nvm use' $HOME/.bashrc)
if [ -z "$NODEJS_PRESENT" ]; then
    nvm install 0.12.2 &> /dev/null
    if [ $? -eq 0 ]; then
        echo 'SETTING DEFAULT NODE VERSION'
        nvm use 0.12.2
        echo 'nvm use 0.12.2' >> .bashrc
    else
        echo 'COULD NOT INSTALL NODE.JS 0.12.2 CHECK YOU INTERNET CONNECTIVITY AND RUN "vagrant reload --provision"'
        exit 1
    fi
else
    echo 'NODEJS ALREADY INSTALLED'
    nvm use 0.12.2
fi

echo 'INSTALLING YEOMAN'
npm install -g yo
echo 'INSTALLING BOWER'
npm install -g bower
echo 'INSTALLING GULP'
npm install -g gulp
cd /vagrant
if [ -d /vagrant/node_modules ]; then
    echo 'DELETING node_modules FOLDER'
    rm -rf /vagrant/node_modules
fi
npm install
bower install
#node server.js &
