#!/bin/bash

# Usage: ./mongo-restore.sh <backup-folder>
if [ -z "$1" ]; then
  echo "Usage: $0 <backup-folder>"
  exit 1
fi

DB_URI=${MONGO_URI:-"mongodb://localhost:27017/indusviaggiapi"}
BACKUP_DIR="$1"

echo "Restoring MongoDB from $BACKUP_DIR to $DB_URI"
mongorestore --uri="$DB_URI" "$BACKUP_DIR"

echo "Restore complete."
