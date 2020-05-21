
# AI Toolkits - flask backend
## How to run a backend server

## Deploy to Herkoku


## Setup ENV variables for virtualenv
- [http://barkas.com/2016/set-environment-variables-activating-virtualenv/](http://barkas.com/2016/set-environment-variables-activating-virtualenv/)
- setup PYTHONPATH to make "from aitoolkit import create_app" work
- add the following code into "/Users/janetyc/.virtualenvs/ai-playground/bin/postactivate"

> export PYTHONPATH=$PYTHONPATH:/Users/janetyc/Documents/Heroku/ai-toolkit

## DB Migration
### How to handle database migrations (by [Flask-Migrate](http://flask-migrate.readthedocs.io/en/latest/) )
- please make sure "environment variables ENV=DEVELOPMENT", which means local database and local server
- init database at *local side*
> python manage.py db init  #only do it at first time
> 
> python manage.py db migrate
> 
> python manage.py db upgrade
- if database scheme changes, do database migration and update
> python manage.py db migrate
> 
> python manage.py db upgrade

- push migrations folder to *server*
> git add migrations/*
> 
> git commit "db migrations"
> 
> git push origin master

- only run db upgrade at remote server
> heroku run python manage.py db upgrade
> 

- if you miss a specific version of db migration, please run
> heroku run python manage.py db upgrade <version_id>

### How to deal with out of sync between remote db and local db
- check the current version of both databases
- export ENV=DEVELOPMENT
> python manage.py db current
> 
> heroku run python manage.py db current

- check the history of database
> python manage.py db history

-  set the correct version for remote db
> heroku run python manage.py db stamp HEAD or
> 
> // Sets the revision in the database to the oe given as an argument, without performing any migrations.
> 
> heroku run python manage.py db stamp <revision> 
> 
> heroku run python manage.py db upgrade

# AI-toolkit - react frontend
## How to run react locally?
> npm run dev //for development
> 
> npm fun build //build a static server to flask
> 
> npm run start //run local react using build folder


## use [react-p5js](https://github.com/atorov/react-p5js)

## Development Logs
- remove ml model from the web server to avoid memory quota exceeded at heroku (2020.05.18)
- object story interface (2020.05.15)
- integrate Albert's frontend react (2019.11.02)
- flask backend + react frontend (use react-p5js) (2019.07.28)
- first setup for ai toolkit web application (2019.07.25)