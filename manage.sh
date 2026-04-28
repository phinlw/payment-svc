#!/bin/bash

# Docker Compose Management Script
# Usage: ./manage.sh [command]

set -e

COMPOSE_FILE="docker-compose.yml"
COMPOSE_FILE_DEV="docker-compose.dev.yml"
PROJECT_NAME="payment-svc"
PROJECT_NAME_DEV="payment-svc-dev"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if docker-compose file exists
check_compose_file() {
    if [ ! -f "$COMPOSE_FILE" ]; then
        print_error "docker-compose.yml not found!"
        exit 1
    fi
}

# Check if external network exists
check_network() {
    if ! docker network ls | grep -q "share-container-network"; then
        print_warning "External network 'share-container-network' not found. Creating..."
        docker network create share-container-network
        print_success "Network created successfully"
    fi
}

# Start services (production)
start() {
    print_status "Starting services (production)..."
    check_compose_file
    check_network
    docker-compose -p "$PROJECT_NAME" up -d
    print_success "Services started successfully"
    status
}

# Check if dev compose file exists
check_dev_compose_file() {
    if [ ! -f "$COMPOSE_FILE_DEV" ]; then
        print_error "docker-compose.dev.yml not found!"
        exit 1
    fi
}

# Start services in development mode
dev() {
    print_status "Starting services in development mode..."
    check_dev_compose_file
    check_network
    docker-compose -f "$COMPOSE_FILE_DEV" -p "$PROJECT_NAME_DEV" up -d
    print_success "Development services started successfully"
    print_status "Watching logs..."
    docker-compose -f "$COMPOSE_FILE_DEV" -p "$PROJECT_NAME_DEV" logs -f
}

# Start development with rebuild
dev_rebuild() {
    print_status "Rebuilding and starting in development mode..."
    check_dev_compose_file
    check_network
    docker-compose -f "$COMPOSE_FILE_DEV" -p "$PROJECT_NAME_DEV" down
    docker-compose -f "$COMPOSE_FILE_DEV" -p "$PROJECT_NAME_DEV" build --no-cache
    docker-compose -f "$COMPOSE_FILE_DEV" -p "$PROJECT_NAME_DEV" up -d
    print_success "Development services rebuilt and started"
    print_status "Watching logs..."
    docker-compose -f "$COMPOSE_FILE_DEV" -p "$PROJECT_NAME_DEV" logs -f
}

# Run in foreground (useful for debugging)
dev_fg() {
    print_status "Starting services in foreground mode..."
    check_dev_compose_file
    check_network
    docker-compose -f "$COMPOSE_FILE_DEV" -p "$PROJECT_NAME_DEV" up
}

# Watch mode - restart on file changes
dev_watch() {
    print_status "Starting in watch mode..."
    check_dev_compose_file
    check_network
    docker-compose -f "$COMPOSE_FILE_DEV" -p "$PROJECT_NAME_DEV" up -d --build
    print_success "Services started. Watching for changes..."
    docker-compose -f "$COMPOSE_FILE_DEV" -p "$PROJECT_NAME_DEV" logs -f
}

# Stop development services
dev_stop() {
    print_status "Stopping development services..."
    check_dev_compose_file
    docker-compose -f "$COMPOSE_FILE_DEV" -p "$PROJECT_NAME_DEV" down
    print_success "Development services stopped successfully"
}

# Show development logs
dev_logs() {
    check_dev_compose_file
    print_status "Showing development logs:"
    docker-compose -f "$COMPOSE_FILE_DEV" -p "$PROJECT_NAME_DEV" logs -f
}

# Show development status
dev_status() {
    print_status "Development service status:"
    check_dev_compose_file
    docker-compose -f "$COMPOSE_FILE_DEV" -p "$PROJECT_NAME_DEV" ps
}

# Stop services
stop() {
    print_status "Stopping services..."
    check_compose_file
    docker-compose -p "$PROJECT_NAME" down
    print_success "Services stopped successfully"
}

# Restart services
restart() {
    print_status "Restarting services..."
    stop
    start
}

# Rebuild and start services
rebuild() {
    print_status "Rebuilding and starting services..."
    check_compose_file
    check_network
    docker-compose -p "$PROJECT_NAME" down
    
    # Clean up build cache and volumes to prevent conflicts
    print_status "Cleaning build cache and volumes..."
    # docker builder prune -f
    docker-compose -p "$PROJECT_NAME" down -v
    
    docker-compose -p "$PROJECT_NAME" build --no-cache
    docker-compose -p "$PROJECT_NAME" up -d
    print_success "Services rebuilt and started successfully"
    status
}

# Show status of services
status() {
    print_status "Service status:"
    check_compose_file
    docker-compose -p "$PROJECT_NAME" ps
}

# Show logs
logs() {
    check_compose_file
    if [ -n "$2" ]; then
        print_status "Showing logs for service: $2"
        docker-compose -p "$PROJECT_NAME" logs -f "$2"
    else
        print_status "Showing logs for all services:"
        docker-compose -p "$PROJECT_NAME" logs -f
    fi
}

# Pull latest images
pull() {
    print_status "Pulling latest images..."
    check_compose_file
    docker-compose -p "$PROJECT_NAME" pull
    print_success "Images pulled successfully"
}

# Create .dockerignore file
create_dockerignore() {
    print_status "Creating .dockerignore file..."
    
    if [ -f ".dockerignore" ]; then
        print_warning ".dockerignore already exists. Backing up to .dockerignore.backup"
        cp .dockerignore .dockerignore.backup
    fi
    
    cat > .dockerignore << 'EOF'
# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage
*.lcov

# NYC test coverage
.nyc_output

# Grunt intermediate storage
.grunt

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test
.env.production

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Git
.git
.gitignore
README.md

# Docker
Dockerfile*
docker-compose*
.dockerignore

# IDE
.vscode
.idea
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
EOF

    print_success ".dockerignore created successfully"
    print_status "This will prevent node_modules from being copied during build"
}

# Fix node_modules conflict
fix_nodemodules() {
    print_status "Fixing node_modules conflict..."
    check_compose_file
    
    # Stop services and remove volumes
    docker-compose -p "$PROJECT_NAME" down -v --remove-orphans
    
    # Remove all related volumes
    docker volume rm "${PROJECT_NAME}_node_modules" 2>/dev/null || true
    docker volume rm "node_modules" 2>/dev/null || true
    
    # Remove all containers for this project
    docker container prune -f
    
    # Clean build cache
    # docker builder prune -f
    
    # Remove images for this project
    docker rmi "${PROJECT_NAME}-payment-svc" 2>/dev/null || true
    docker rmi "payment-svc-image:latest" 2>/dev/null || true
    
    # Remove any dangling images
    docker image prune -f
    
    print_success "node_modules conflict fixed."
    print_warning "IMPORTANT: Create a .dockerignore file with 'node_modules' to prevent this issue"
}

# Clean up (remove containers, networks, volumes, and images)
clean() {
    print_warning "This will remove all containers, networks, volumes, and images for this project"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up..."
        docker-compose -p "$PROJECT_NAME" down -v --rmi all --remove-orphans
        print_success "Cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Execute command in a service
exec_service() {
    if [ -z "$2" ]; then
        print_error "Please specify a service name"
        print_status "Available services: payment-svc"
        exit 1
    fi
    
    service_name="$2"
    shift 2
    command_args="$@"
    
    if [ -z "$command_args" ]; then
        command_args="/bin/sh"
    fi
    
    print_status "Executing command in $service_name: $command_args"
    docker-compose -p "$PROJECT_NAME" exec "$service_name" $command_args
}

# Show help
show_help() {
    echo "Docker Compose Management Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "${GREEN}Production Commands:${NC}"
    echo "  start         Start all services (detached)"
    echo "  stop          Stop all services"
    echo "  restart       Restart all services"
    echo "  rebuild       Rebuild images and start services"
    echo ""
    echo "${YELLOW}Development Commands:${NC}"
    echo "  dev           Start dev services and follow logs"
    echo "  dev:rebuild   Rebuild and start dev with logs"
    echo "  dev:fg        Start dev in foreground (no detach)"
    echo "  dev:watch     Build and start dev with logs"
    echo "  dev:stop      Stop dev services"
    echo "  dev:logs      Show dev logs"
    echo "  dev:status    Show dev service status"
    echo ""
    echo "${BLUE}Utility Commands:${NC}"
    echo "  status        Show status of services"
    echo "  logs          Show logs (optionally for specific service)"
    echo "  pull          Pull latest images"
    echo "  dockerignore  Create .dockerignore file to prevent node_modules conflicts"
    echo "  fix           Fix node_modules conflict issues"
    echo "  clean         Remove containers, networks, volumes, and images"
    echo "  exec          Execute command in service"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start              # Production start"
    echo "  $0 dev                # Development with logs"
    echo "  $0 dev:rebuild        # Rebuild and dev mode"
    echo "  $0 logs payment-svc   # View specific service logs"
    echo "  $0 exec payment-svc /bin/sh"
    echo "  $0 exec payment-svc pnpm install"
    echo ""
    echo "Services available:"
    echo "  - payment-svc (main application)"
    echo "    gRPC  port: 7069"
    echo "    REST  port: 7070"
}

# Main script logic
case "${1:-help}" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    rebuild)
        rebuild
        ;;
    dev)
        dev
        ;;
    dev:rebuild)
        dev_rebuild
        ;;
    dev:fg)
        dev_fg
        ;;
    dev:watch)
        dev_watch
        ;;
    dev:stop)
        dev_stop
        ;;
    dev:logs)
        dev_logs
        ;;
    dev:status)
        dev_status
        ;;
    status)
        status
        ;;
    logs)
        logs "$@"
        ;;
    pull)
        pull
        ;;
    dockerignore)
        create_dockerignore
        ;;
    fix)
        fix_nodemodules
        ;;
    clean)
        clean
        ;;
    exec)
        exec_service "$@"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac