# SpaceX Stats
A fan website for the company SpaceX originally created by Luke Davia ([Twitter](https://twitter.com/lukealization), [Reddit](https://reddit.com/u/EchoLogic)). The current React front-end uses the [SpaceX API](https://github.com/r-spacex/SpaceX-API).

## How to contribute

The project will be installed on a Vagrant virtual machine. All the dev tools will be installed inside it.

### Prereqs
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- [Vagrant](https://www.vagrantup.com/downloads.html)

### Setup instructions

1. In the project directory, run the `vagrant up` command.
2. Add this line to your hostfile (`/etc/hosts` on Linux/Mac, `C:\Windows\system32\drivers\etc\hosts` on Windows): `33.33.33.33 spacexstats.dev`.
3. Log into the Vagrant machine using `vagrant ssh` then do `yarn start`. The project is now accessible by going to `http://spacexstats.dev:8080`!
4. ...
5. Profit!

Remember, when you stop working on the project you can stop the Vagrant box with `vagrant halt`. You can delete it with `vagrant destroy`.


## Deployement

Push on the `master` branch.
