sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/10gen.list
sudo apt-get update
apt-get install mongodb-10gen=2.2.3
echo "mongodb-10gen hold" | sudo dpkg --set-selections
sudo service mongodb start