VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/xenial64"

  config.vm.provider :virtualbox do |v|
    v.name = "spacexstats"
    v.memory = 1024
    v.cpus = 2
  end

  config.vm.hostname = "spacexstats"
  config.vm.network "private_network", ip: "33.33.33.33"

  # Ansible provisioner.
  config.vm.provision "ansible_local" do |ansible|
    ansible.playbook = "devops/provision-dev.yml"
    ansible.become = true
  end
end
