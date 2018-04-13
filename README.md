# buttcloud-provider

a hosted Scuttlebutt pub-as-a-service provider

```shell
git clone git@github.com:buttcloud/buttcloud-provider
cd buttcloud-provider
npm install
npm start
```

## design

### ux

- join
  - land
  - sign in
  - create pub
  - pay for pub
  - start pub service
- monitor
  - land
  - sign in
  - view pub
  - see stats
- command
  - land
  - sign in
  - view pub
  - run command

### data models

- users
  - id
  - name
  - email
- pub
  - bots
    - id
    - userId
    - name
    - status (up, down, none)
  - stats 
    - stream Docker stats
  - commands
    - relay commands to pub services
  - orchestrator
    - on schedule, check what pubs are up
    - have 1 pub per 1 GB memory, 1 hub per 15 GB memory
    - queue worker jobs to ensure correct swarm
- payment
  - products
  - plans
  - customers
  - subscriptions

### architecture

- web server
- swarm worker
  - manage hub [machines](https://docs.docker.com/machine/drivers/openstack/)
    - create hub
    - destroy hub
  - manage pub [services](https://docs.docker.com/engine/swarm/swarm-tutorial/deploy-service/)
    - ensure pub service is up
    - ensure pub service is down
- mailer worker
- pub service(s)

## stack

- web server
  - [@feathersjs/socketio](https://github.com/feathersjs/socketio)
  - [@feathersjs/authentication](https://github.com/feathersjs/authentication)
  - [@feathersjs/authentication-jwt](https://github.com/feathersjs/authentication-jwt)
  - [feathers-stripe](https://github.com/feathersjs-ecosystem/feathers-stripe)
  - [node-resque](https://github.com/taskrabbit/node-resque)
  - [docker-remote-api](https://github.com/mafintosh/docker-remote-api)
- web app
  - [next.js](https://github.com/zeit/next.js/)
  - [ramda](http://ramdajs.com/docs/)
  - [@feathersjs/socketio-client](https://github.com/feathersjs/socketio-client)
  - [@feathersjs/authentication-client](https://github.com/feathersjs/authentication-client)
  - [react](https://facebook.github.io/react)
  - [react-hyperscript](https://github.com/mlmorg/react-hyperscript)
  - [recompose](https://github.com/acdlite/recompose)
  - [fela](https://github.com/rofrischmann/fela)
  - [material-ui](https://material-ui.com/)
  - [react-stripe-elements](https://github.com/stripe/react-stripe-elements)
- swarm worker
  - [node-resque](https://github.com/taskrabbit/node-resque)
  - [docker-remote-api](https://github.com/mafintosh/docker-remote-api)
- mailer worker
  - [node-resque](https://github.com/taskrabbit/node-resque)
  - [nodemailer](https://github.com/nodemailer/nodemailer)
  - third-party: [sendgrid](https://sendgrid.com/)
  - dev tool: [maildev](https://github.com/djfarrelly/maildev)
