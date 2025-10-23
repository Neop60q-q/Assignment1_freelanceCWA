# Backend Commands Reference Guide

This guide contains all frequently used commands for managing the backend of the Questionnaire Builder application.

## Table of Contents
- [Container Viewing Commands](#container-viewing-commands)
- [Docker & Container Management](#docker--container-management)
- [Database & Prisma Commands](#database--prisma-commands)
- [API Development](#api-development)
- [Debugging Commands](#debugging-commands)
- [Quick Restart Sequences](#quick-restart-sequences)
- [File Management](#file-management)
- [Troubleshooting](#troubleshooting)

---

## Container Viewing Commands

### View Running Containers
```bash
docker ps                    # Show currently running containers
docker ps -a                 # Show all containers (running and stopped)
docker-compose ps            # Show containers defined in docker-compose.yml
```

### Container Information
```bash
docker inspect <container_name>     # Detailed container information
docker stats                        # Real-time container resource usage
docker logs <container_name>        # View container logs
```

---

## Docker & Container Management

### Starting Services
```bash
# Start all services (builds if needed)
docker-compose up --build

# Start services in background (detached mode)
docker-compose up -d --build

# Start specific service
docker-compose up --build api
docker-compose up --build frontend

# Force rebuild without cache
docker-compose build --no-cache
docker-compose up --build --no-cache
```

### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# Stop specific service
docker-compose stop api
docker-compose stop frontend
```

### Container Access
```bash
# Access container shell
docker exec -it <container_name> bash
docker-compose exec api bash
docker-compose exec frontend bash

# Run commands in container without entering shell
docker-compose exec api npm install
docker-compose exec api npx prisma generate
```

### Logs and Monitoring
```bash
# View logs
docker-compose logs api              # API container logs
docker-compose logs frontend         # Frontend container logs
docker-compose logs -f api          # Follow API logs in real-time
docker-compose logs --tail=50 api   # Show last 50 log lines

# View all service logs
docker-compose logs -f
```

---

## Database & Prisma Commands

**Note:** Run these commands inside the API container:
```bash
# First, enter the API container
docker-compose exec api bash
```

### Schema Management
```bash
# Update database with current schema (no migrations)
npx prisma db push

# Create a new migration
npx prisma migrate dev --name <migration_name>

# Apply pending migrations
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Client Generation
```bash
# Generate Prisma client after schema changes
npx prisma generate

# Install dependencies and generate client
npm install && npx prisma generate
```

### Database Tools
```bash
# Open Prisma Studio (database browser)
npx prisma studio

# Seed database with initial data
npx prisma db seed

# View database structure
npx prisma db pull
```

### Database Status
```bash
# Check migration status
npx prisma migrate status

# Validate schema
npx prisma validate

# Format schema file
npx prisma format
```

---

## API Development

### API Health Checks
```bash
# Check if API is running
curl http://localhost:4080/api/questionnaires

# Test with verbose output
curl -v http://localhost:4080/api/questionnaires

# Check API health endpoint (if implemented)
curl http://localhost:4080/health
```

### API Testing
```bash
# GET all questionnaires
curl -X GET http://localhost:4080/api/questionnaires

# GET specific questionnaire
curl -X GET "http://localhost:4080/api/questionnaires?id=<questionnaire_id>"

# POST new questionnaire
curl -X POST http://localhost:4080/api/questionnaires \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Questionnaire","description":"Test Description"}'

# DELETE questionnaire
curl -X DELETE "http://localhost:4080/api/questionnaires?id=<questionnaire_id>"
```

### Development Commands
```bash
# Install new package in API
docker-compose exec api npm install <package_name>

# Run TypeScript type checking
docker-compose exec api npx tsc --noEmit

# Run linting
docker-compose exec api npm run lint

# Run tests (if configured)
docker-compose exec api npm test
```

---

## Debugging Commands

### Container Inspection
```bash
# Check container status
docker ps
docker-compose ps

# Inspect container configuration
docker inspect <container_name>

# Check container processes
docker top <container_name>

# View container filesystem
docker exec -it <container_name> ls -la
docker exec -it <container_name> find / -name "*.log"
```

### Resource Monitoring
```bash
# Real-time resource usage
docker stats

# System-wide Docker info
docker system df        # Disk usage
docker system info      # System information
docker system prune     # Clean up unused resources
```

### Network Debugging
```bash
# List Docker networks
docker network ls

# Inspect network
docker network inspect <network_name>

# Test network connectivity from container
docker exec -it <container_name> ping <other_container_name>

# Check port bindings
docker port <container_name>
```

### Log Analysis
```bash
# Search logs for errors
docker-compose logs api | grep -i error
docker-compose logs api | grep -i "prisma"
docker-compose logs api | grep -i "database"

# Export logs to file
docker-compose logs api > api_logs.txt
```

---

## Quick Restart Sequences

### Full Application Restart
```bash
# Complete restart with rebuild
docker-compose down
docker-compose up --build -d
docker-compose logs -f api
```

### Database Reset and Restart
```bash
# Stop services
docker-compose down -v

# Start and rebuild
docker-compose up --build -d

# Reset database and apply schema
docker-compose exec api npx prisma migrate reset --force
docker-compose exec api npx prisma db push
```

### Development Restart (faster)
```bash
# Restart without rebuild
docker-compose restart api
docker-compose logs -f api
```

### API-Only Restart
```bash
# Restart just the API service
docker-compose restart api
docker-compose exec api npx prisma generate
```

---

## File Management

### File Operations
```bash
# Copy files from container to host
docker cp <container_name>:/path/to/file ./local/path

# Copy files from host to container
docker cp ./local/file <container_name>:/path/to/destination

# Edit files in container
docker exec -it <container_name> nano /path/to/file
docker exec -it <container_name> vi /path/to/file
```

### Backup and Restore
```bash
# Backup database (if using PostgreSQL)
docker-compose exec db pg_dump -U username dbname > backup.sql

# Backup Prisma migrations
cp -r ./api/prisma/migrations ./backups/migrations-$(date +%Y%m%d)
```

---

## Troubleshooting

### Common Issues and Solutions

#### Container Won't Start
```bash
# Check for port conflicts
netstat -tulpn | grep :4080
netstat -tulpn | grep :80

# Clean up and restart
docker-compose down
docker system prune -f
docker-compose up --build
```

#### Database Connection Issues
```bash
# Check database container
docker-compose logs db

# Test database connection from API container
docker-compose exec api npx prisma db pull
```

#### API Not Responding
```bash
# Check if API container is running
docker-compose ps

# Check API logs for errors
docker-compose logs -f api

# Restart API service
docker-compose restart api
```

#### Prisma Issues
```bash
# Regenerate Prisma client
docker-compose exec api npx prisma generate

# Reset and reapply schema
docker-compose exec api npx prisma migrate reset --force
docker-compose exec api npx prisma db push
```

### Emergency Commands
```bash
# Kill all Docker containers
docker kill $(docker ps -q)

# Remove all containers
docker rm $(docker ps -aq)

# Clean everything (WARNING: removes all Docker data)
docker system prune -a --volumes
```

---

## Environment Variables

### Common Environment Variables
```bash
# View environment variables in container
docker-compose exec api env

# Set environment variable temporarily
docker-compose exec api bash -c 'export NODE_ENV=development && npm start'
```

---

## Useful Aliases

Add these to your `~/.bashrc` or `~/.bash_aliases`:

```bash
# Docker shortcuts
alias dps='docker ps'
alias dpsa='docker ps -a'
alias dcu='docker-compose up --build'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dcr='docker-compose restart'

# API specific
alias api-logs='docker-compose logs -f api'
alias api-shell='docker-compose exec api bash'
alias api-restart='docker-compose restart api'

# Database shortcuts
alias db-push='docker-compose exec api npx prisma db push'
alias db-studio='docker-compose exec api npx prisma studio'
alias db-generate='docker-compose exec api npx prisma generate'
```

---

## Service URLs

- **Frontend**: http://localhost:80
- **API**: http://localhost:4080
- **Prisma Studio**: http://localhost:5555 (when running)

---

*Last updated: October 22, 2025*