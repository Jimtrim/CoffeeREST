Vagrant::Config.run do |config|
  config.vm.box     = "base"
  config.vm.box_url = "http://files.vagrantup.com/lucid64.box"

  # config.vm.network "33.33.33.10"
  config.vm.forward_port 27017, 27018

  
  config.vm.provision :shell, :path => "setup_vagrant.sh"
  
end
