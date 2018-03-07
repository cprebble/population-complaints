#!/bin/sh
postgres_host=$1
postgres_port=$2
shift 2
cmd="$@"

# wait for the postgres docker to be running
while ! nc $postgres_host $postgres_port; do
  >&2 echo "Postgres is unavailable - waiting"
  sleep 1
done

>&2 echo "Postgres is up - executing command"

# run the command
exec $cmd