#!/bin/bash
# SocioImpact ERP - Rapid Setup Script
# Run this after the initial scaffolding to set everything up

echo "=== SocioImpact ERP System - Setup Script ==="
echo ""

# Step 1: Artisan Scaffolding
echo "Step 1: Generating Factories, Seeders, Actions, Policies, Requests, Controllers..."

# Factories
php artisan make:factory DivisionFactory --no-interaction
php artisan make:factory ProjectFactory --no-interaction
php artisan make:factory ProjectMilestoneFactory --no-interaction
php artisan make:factory ProjectBudgetFactory --no-interaction
php artisan make:factory ReimbursementFactory --no-interaction
php artisan make:factory LeaveFactory --no-interaction
php artisan make:factory PresenceFactory --no-interaction

# Seeders
php artisan make:seeder DivisionSeeder --no-interaction
php artisan make:seeder UserSeeder --no-interaction

# Actions (remaining)
php artisan make:action "UpdateProject" --no-interaction
php artisan make:action "RejectReimbursement" --no-interaction
php artisan make:action "ApproveLeave" --no-interaction
php artisan make:action "RejectLeave" --no-interaction
php artisan make:action "UploadProjectDocument" --no-interaction

# Policies
php artisan make:policy ProjectPolicy --no-interaction
php artisan make:policy ReimbursementPolicy --no-interaction
php artisan make:policy LeavePolicy --no-interaction

# Form Requests
php artisan make:request StoreProjectRequest --no-interaction
php artisan make:request UpdateProjectRequest --no-interaction
php artisan make:request StoreReimbursementRequest --no-interaction
php artisan make:request StoreLeaveRequest --no-interaction
php artisan make:request CheckInRequest --no-interaction
php artisan make:request ApproveReimbursementRequest --no-interaction
php artisan make:request ApproveLeaveRequest --no-interaction

# Controllers
php artisan make:controller ProjectController --no-interaction
php artisan make:controller ReimbursementController --no-interaction
php artisan make:controller LeaveController --no-interaction
php artisan make:controller PresenceController --no-interaction
php artisan make:controller Admin/UserController --no-interaction
php artisan make:controller Admin/DivisionController --no-interaction

echo "✅ Scaffolding complete!"
echo ""

# Step 2: Migrations
echo "Step 2: Running migrations..."
php artisan migrate

echo "✅ Migrations complete!"
echo ""

# Step 3: Pint Formatting
echo "Step 3: Formatting code with Pint..."
vendor/bin/pint --dirty

echo "✅ Code formatted!"
echo ""

# Step 4: Frontend shadcn
echo "Step 4: Setting up shadcn components..."
npx shadcn@latest init
npx shadcn@latest add button input label card badge table tabs dialog dropdown-menu sheet textarea select calendar separator breadcrumb tooltip avatar sonner toast

echo "✅ shadcn setup complete!"
echo ""

# Step 5: Build frontend
echo "Step 5: Building frontend..."
npm run build

echo "✅ Frontend built!"
echo ""

echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Edit factories in database/factories/ to add proper relationships"
echo "2. Edit seeders in database/seeders/ and run: php artisan db:seed"
echo "3. Copy/paste controller and policy code from IMPLEMENTATION_GUIDE.md"
echo "4. Run tests: php artisan test"
echo "5. Start dev server: composer run dev"
echo ""
echo "For detailed instructions, see IMPLEMENTATION_GUIDE.md and COMPLETION_SUMMARY.md"
