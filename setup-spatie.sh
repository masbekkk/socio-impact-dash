#!/bin/bash

# SocioImpact ERP - Complete Setup Script with Spatie Permissions
# This script generates all necessary scaffolding and files

cd "$(dirname "$0")" || exit

echo "🚀 Starting SocioImpact ERP Setup with Spatie Permissions..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Generate Controllers
echo -e "${BLUE}[1/8] Generating Controllers...${NC}"
php artisan make:controller ProjectController --resource --requests --model=Project
php artisan make:controller ReimbursementController --resource --requests --model=Reimbursement
php artisan make:controller LeaveController --resource --requests --model=Leave
php artisan make:controller PresenceController --requests --model=Presence
php artisan make:controller Admin/UserController --resource --requests --model=User
php artisan make:controller Admin/DivisionController --resource --requests --model=Division

# Step 2: Generate Policies
echo -e "${BLUE}[2/8] Generating Policies...${NC}"
php artisan make:policy ProjectPolicy --model=Project
php artisan make:policy ReimbursementPolicy --model=Reimbursement
php artisan make:policy LeavePolicy --model=Leave

# Step 3: Generate Form Requests
echo -e "${BLUE}[3/8] Generating Form Requests...${NC}"
php artisan make:request StoreProjectRequest
php artisan make:request UpdateProjectRequest
php artisan make:request StoreReimbursementRequest
php artisan make:request UpdateReimbursementRequest
php artisan make:request StoreLeaveRequest
php artisan make:request UpdateLeaveRequest
php artisan make:request CheckInPresenceRequest
php artisan make:request ApproveReimbursementRequest
php artisan make:request ApproveLeaveRequest

# Step 4: Generate Additional Actions
echo -e "${BLUE}[4/8] Generating Additional Actions...${NC}"
php artisan make:action UpdateProjectAction
php artisan make:action DeleteProjectAction
php artisan make:action RejectReimbursementAction
php artisan make:action ApproveLeaveAction
php artisan make:action RejectLeaveAction

# Step 5: Generate Factories
echo -e "${BLUE}[5/8] Generating Factories...${NC}"
php artisan make:factory DivisionFactory
php artisan make:factory ProjectFactory
php artisan make:factory ProjectMilestoneFactory
php artisan make:factory ProjectBudgetFactory
php artisan make:factory ReimbursementFactory
php artisan make:factory LeaveFactory
php artisan make:factory PresenceFactory

# Step 6: Generate Seeders
echo -e "${BLUE}[6/8] Generating Seeders...${NC}"
php artisan make:seeder RoleAndPermissionSeeder
php artisan make:seeder DivisionSeeder
php artisan make:seeder UserSeeder

# Step 7: Format Code
echo -e "${BLUE}[7/8] Formatting code with Pint...${NC}"
vendor/bin/pint --dirty

# Step 8: Migrate Database
echo -e "${BLUE}[8/8] Running migrations...${NC}"
php artisan migrate:fresh

# Step 9: Seed Database
echo -e "${BLUE}[9/9] Seeding database...${NC}"
php artisan db:seed

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Copy code from IMPLEMENTATION_GUIDE_SPATIE.md into generated files"
echo "2. Run: npm run build"
echo "3. Run: composer run dev"
echo "4. Visit http://localhost:8000"
echo ""
