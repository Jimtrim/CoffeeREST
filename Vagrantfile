Vagrant::Config.run do |config|
  
  config.vm.customize ["modifyvm", :id, "--name", "Online CoffeDB"]
  config.vm.box     = "precise32"
  config.vm.box_url = "http://files.vagrantup.com/precise.box"

  config.vm.host_name = "dev-cofferest"
  config.vm.network :hostonly, "192.168.40.50"
  config.vm.forward_port 27017, 27018

  config.vm.provision :shell, :path => "setup_vagrant.sh"
  
end
