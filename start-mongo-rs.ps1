# This script will stop the current MongoDB service (if possible) and start a local instance with a Replica Set
# This is required for Prisma to work with MongoDB

$DB_PATH = ".\mongo_data"
if (!(Test-Path $DB_PATH)) {
    New-Item -ItemType Directory -Path $DB_PATH
}

Write-Host "Starting MongoDB with Replica Set..." -ForegroundColor Cyan
mongod --dbpath $DB_PATH --replSet rs0 --port 27017 --bind_ip 127.0.0.1
