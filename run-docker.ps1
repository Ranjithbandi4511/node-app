# Run API container connected to mongo service from docker-compose.yaml
docker compose -f docker-compose.yaml up -d mongo

docker run --rm -p 5000:5000 `
  --network node-app_default `
  -e PORT=5000 `
  -e MONGODB_URI=mongodb://admin:qwerty@mongo:27017/?authSource=admin `
  -e MONGODB_DB=dental-db `
  node-app:1.0
