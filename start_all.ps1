$env:POSTGRES_HOST="localhost"
$env:POSTGRES_USER="merkato"
$env:POSTGRES_PASSWORD="merkatopassword"
$env:POSTGRES_DB="merkatomotors"

npx concurrently -k -c "blue,green,yellow,magenta,cyan,red,white,gray" `
  "npm run dev --prefix apps/services/crm" `
  "npm run dev --prefix apps/services/vehicle" `
  "npm run dev --prefix apps/services/finance" `
  "npm run dev --prefix apps/services/deal" `
  "npm run dev --prefix apps/services/partner" `
  "npm run dev --prefix apps/services/lead" `
  "npm run dev --prefix apps/services/analytics" `
  "npm run dev --prefix apps/api-gateway"
