#!/bin/bash
set -e
echo "SITC Website — Setup"

# 1. Prerequisites
command -v docker >/dev/null || { echo "Docker required"; exit 1; }
command -v docker compose >/dev/null || { echo "Docker Compose required"; exit 1; }

# 2. Generate .env if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=$(openssl rand -hex 16)|" .env
    sed -i "s|^PAYLOAD_SECRET=.*|PAYLOAD_SECRET=$(openssl rand -hex 32)|" .env
    GENERATED_PASS=$(openssl rand -base64 12)
    sed -i "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=${GENERATED_PASS}|" .env
    echo ""
    echo "Generated .env with random secrets."
    echo "  Admin password: ${GENERATED_PASS}"
    echo ""
    echo "Edit SITE_DOMAIN and ADMIN_EMAIL before proceeding."
    echo "Then re-run: ./setup.sh"
    exit 0
fi

# 3. Build and start
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# 4. Wait for app to be ready
echo "Waiting for app..."
until curl -sf http://localhost:3000/api/health > /dev/null 2>&1; do sleep 2; done

# 5. Run migrations
docker compose -f docker-compose.prod.yml exec app pnpm payload migrate

# 6. Seed placeholder content
docker compose -f docker-compose.prod.yml exec app pnpm seed

echo ""
echo "Setup complete!"
echo "  Site:     https://$(grep SITE_DOMAIN .env | cut -d= -f2)/v1  /v2  /v3"
echo "  Admin:    https://$(grep SITE_DOMAIN .env | cut -d= -f2)/admin"
echo "  Credentials in .env"
