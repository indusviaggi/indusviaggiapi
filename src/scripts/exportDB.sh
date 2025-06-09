#!/bin/bash

# Load environment variables from .env if needed
if [ -f ../.env ]; then
  export $(cat ../.env | grep -v '^#' | xargs)
fi

# Set defaults or use env vars
DB_URI=${MONGO_URI:-"mongodb://localhost:27017/indusviaggiapi"}
BACKUP_DIR=${BACKUP_DIR:-"./backup/$(date +%F_%H-%M-%S)"}

echo "Backing up MongoDB from $DB_URI to $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

mongodump --uri="$DB_URI" --out="$BACKUP_DIR"

echo "Backup complete: $BACKUP_DIR"