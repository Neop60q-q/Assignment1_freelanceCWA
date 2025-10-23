Had issues with docker compose building error
[+] Building 0.0s (0/0)                                                                                   
unknown flag: --allow

processes by CHEE
1. docker build -t frontend, api (postgres is pre-built image)
2. docker-compose up those containers, 'running' them
3. use CRUD operation via curl commands
4. link frontend(buttons etc) to perform CRUD commands via fetch/API calls


visualising database via prisma studio
Unix/Linux:
1. sudo docker-compose -f docker-compose-fixed.yml up prisma-studio -d
2. go http://localhost:5555 on url

PowerShell (Windows):
1. docker-compose -f docker-compose-fixed.yml up prisma-studio -d
2. go http://localhost:5555 on url

or run locally:
PowerShell: cd api; npx prisma studio
Unix: cd api && npx prisma studio
go http://localhost:5555



# UNIX/LINUX COMMANDS:
# building:
sudo docker build -t assignment1-frontend ./frontend
sudo docker build -t assignment1-api ./api

# running:
sudo docker-compose -f docker-compose-fixed.yml up -d
sudo docker-compose -f docker-compose-fixed.yml up postgres -d

# useful commands:
sudo docker ps
sudo docker-compose -f docker-compose-fixed.yml down
sudo docker-compose -f docker-compose-fixed.yml logs

--
# POWERSHELL/WINDOWS COMMANDS:
# building:
docker build -t assignment1-frontend ./frontend
docker build -t assignment1-api ./api

# running:
docker-compose -f docker-compose-fixed.yml up -d
docker-compose -f docker-compose-fixed.yml up postgres -d

# useful commands:
docker ps
docker-compose -f docker-compose-fixed.yml down
docker-compose -f docker-compose-fixed.yml logs

--
# CURL COMMANDS (both Unix & PowerShell):
# GET all questionnaires
curl http://localhost:4080/api/questionnaires

# POST create new
curl -X POST http://localhost:4080/api/questionnaires -H "Content-Type: application/json" -d "{\"timer\": 60, \"question\": \"Test\", \"expectedAnswer\": \"Answer\"}"

# PATCH update (replace ID with actual number)
curl -X PATCH "http://localhost:4080/api/questionnaires?id=1" -H "Content-Type: application/json" -d "{\"timer\": 120}"

# DELETE (replace ID with actual number)
curl -X DELETE "http://localhost:4080/api/questionnaires?id=1"