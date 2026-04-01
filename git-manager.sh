#!/bin/bash

# Git Manager - Modern Git Management Script
# Author: Cascade AI
# Version: 1.0.0
# Description: A modern, quick, and easy-to-use Git management tool

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Emojis for better UX
ROCKET="🚀"
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"
BRANCH="🌿"
COMMIT="📝"
PUSH="⬆️"
PULL="⬇️"
MERGE="🔀"
TAG="🏷️"

# Print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

# Print header
print_header() {
    echo ""
    print_color $CYAN "╔══════════════════════════════════════════════════════════════╗"
    print_color $CYAN "║                    ${ROCKET} GIT MANAGER ${ROCKET}                         ║"
    print_color $CYAN "║              Modern Git Management Made Easy                 ║"
    print_color $CYAN "╚══════════════════════════════════════════════════════════════╝"
    echo ""
}

# Check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_color $RED "${CROSS} Not a git repository!"
        echo "Run 'git init' to initialize a new repository or navigate to an existing one."
        exit 1
    fi
}

# Get current branch name
get_current_branch() {
    git branch --show-current
}

# Get repository status
get_repo_status() {
    local current_branch=$(get_current_branch)
    local status_output=$(git status --porcelain)
    local ahead_behind=$(git rev-list --left-right --count origin/$current_branch...$current_branch 2>/dev/null || echo "0	0")
    local behind=$(echo $ahead_behind | cut -f1)
    local ahead=$(echo $ahead_behind | cut -f2)
    
    echo "Branch: $current_branch"
    if [ ! -z "$status_output" ]; then
        echo "Status: Changes detected"
    else
        echo "Status: Clean"
    fi
    echo "Ahead: $ahead commits | Behind: $behind commits"
}

# Show main menu
show_menu() {
    print_header
    
    # Show current repository status
    print_color $BLUE "${INFO} Repository Status:"
    get_repo_status
    echo ""
    
    print_color $WHITE "Choose an option:"
    echo ""
    print_color $GREEN "  1. ${COMMIT} Quick Commit (add all + commit + push)"
    print_color $GREEN "  2. ${COMMIT} Smart Commit (interactive staging)"
    print_color $YELLOW "  3. ${BRANCH} Branch Management"
    print_color $BLUE "  4. ${PULL} Pull Latest Changes"
    print_color $PURPLE "  5. ${PUSH} Push Current Branch"
    print_color $CYAN "  6. ${MERGE} Merge Operations"
    print_color $WHITE "  7. ${TAG} Tag Management"
    print_color $YELLOW "  8. ${INFO} Repository Info"
    print_color $GREEN "  9. 🔧 Git Utilities"
    print_color $RED "  0. Exit"
    echo ""
    printf "Enter your choice [0-9]: "
}

# Quick commit function
quick_commit() {
    print_color $CYAN "${ROCKET} Quick Commit Process"
    echo ""
    
    # Check for changes
    if [ -z "$(git status --porcelain)" ]; then
        print_color $YELLOW "${WARNING} No changes to commit!"
        return
    fi
    
    # Show what will be committed
    print_color $BLUE "Files to be committed:"
    git status --short
    echo ""
    
    # Get commit message
    printf "Enter commit message: "
    read commit_message
    
    if [ -z "$commit_message" ]; then
        print_color $RED "${CROSS} Commit message cannot be empty!"
        return
    fi
    
    # Add all files
    print_color $YELLOW "Adding all files..."
    git add .
    
    # Commit
    print_color $YELLOW "Committing changes..."
    git commit -m "$commit_message"
    
    # Push
    printf "Push to remote? (y/N): "
    read push_confirm
    if [[ $push_confirm =~ ^[Yy]$ ]]; then
        print_color $YELLOW "Pushing to remote..."
        git push origin $(get_current_branch)
        print_color $GREEN "${CHECK} Successfully committed and pushed!"
    else
        print_color $GREEN "${CHECK} Successfully committed!"
    fi
}

# Smart commit function
smart_commit() {
    print_color $CYAN "${ROCKET} Smart Commit Process"
    echo ""
    
    # Check for changes
    if [ -z "$(git status --porcelain)" ]; then
        print_color $YELLOW "${WARNING} No changes to commit!"
        return
    fi
    
    # Interactive staging
    print_color $BLUE "Current changes:"
    git status --short
    echo ""
    
    printf "Use interactive staging? (y/N): "
    read interactive
    
    if [[ $interactive =~ ^[Yy]$ ]]; then
        git add -i
    else
        printf "Add all files? (Y/n): "
        read add_all
        if [[ ! $add_all =~ ^[Nn]$ ]]; then
            git add .
        else
            printf "Enter files to add (space-separated): "
            read files_to_add
            git add $files_to_add
        fi
    fi
    
    # Show staged changes
    echo ""
    print_color $BLUE "Staged changes:"
    git diff --cached --name-only
    echo ""
    
    # Get commit message
    printf "Enter commit message: "
    read commit_message
    
    if [ -z "$commit_message" ]; then
        print_color $RED "${CROSS} Commit message cannot be empty!"
        return
    fi
    
    # Commit
    git commit -m "$commit_message"
    print_color $GREEN "${CHECK} Successfully committed!"
    
    # Push option
    printf "Push to remote? (y/N): "
    read push_confirm
    if [[ $push_confirm =~ ^[Yy]$ ]]; then
        git push origin $(get_current_branch)
        print_color $GREEN "${CHECK} Successfully pushed!"
    fi
}

# Branch management
branch_management() {
    print_color $CYAN "${BRANCH} Branch Management"
    echo ""
    
    print_color $WHITE "Choose an option:"
    echo "  1. List all branches"
    echo "  2. Create new branch"
    echo "  3. Switch branch"
    echo "  4. Delete branch"
    echo "  5. Rename current branch"
    echo "  0. Back to main menu"
    echo ""
    printf "Enter your choice [0-5]: "
    read branch_choice
    
    case $branch_choice in
        1)
            print_color $BLUE "All branches:"
            git branch -a
            ;;
        2)
            printf "Enter new branch name: "
            read new_branch
            if [ ! -z "$new_branch" ]; then
                git checkout -b "$new_branch"
                print_color $GREEN "${CHECK} Created and switched to branch: $new_branch"
            fi
            ;;
        3)
            print_color $BLUE "Available branches:"
            git branch
            echo ""
            printf "Enter branch name to switch to: "
            read switch_branch
            if [ ! -z "$switch_branch" ]; then
                git checkout "$switch_branch"
                print_color $GREEN "${CHECK} Switched to branch: $switch_branch"
            fi
            ;;
        4)
            print_color $BLUE "Local branches:"
            git branch
            echo ""
            printf "Enter branch name to delete: "
            read delete_branch
            if [ ! -z "$delete_branch" ]; then
                printf "Are you sure? This cannot be undone (y/N): "
                read confirm_delete
                if [[ $confirm_delete =~ ^[Yy]$ ]]; then
                    git branch -D "$delete_branch"
                    print_color $GREEN "${CHECK} Deleted branch: $delete_branch"
                fi
            fi
            ;;
        5)
            printf "Enter new name for current branch: "
            read new_name
            if [ ! -z "$new_name" ]; then
                git branch -m "$new_name"
                print_color $GREEN "${CHECK} Renamed branch to: $new_name"
            fi
            ;;
        0)
            return
            ;;
        *)
            print_color $RED "${CROSS} Invalid option!"
            ;;
    esac
    
    printf "\nPress Enter to continue..."
    read
}

# Pull latest changes
pull_changes() {
    print_color $CYAN "${PULL} Pulling Latest Changes"
    echo ""
    
    local current_branch=$(get_current_branch)
    print_color $BLUE "Pulling changes for branch: $current_branch"
    
    # Check for uncommitted changes
    if [ ! -z "$(git status --porcelain)" ]; then
        print_color $YELLOW "${WARNING} You have uncommitted changes!"
        printf "Stash changes before pulling? (Y/n): "
        read stash_confirm
        if [[ ! $stash_confirm =~ ^[Nn]$ ]]; then
            git stash push -m "Auto-stash before pull $(date)"
            print_color $GREEN "${CHECK} Changes stashed"
        fi
    fi
    
    # Pull changes
    git pull origin "$current_branch"
    print_color $GREEN "${CHECK} Successfully pulled latest changes!"
    
    # Check if there are stashed changes
    if git stash list | grep -q "Auto-stash before pull"; then
        printf "Apply stashed changes? (Y/n): "
        read apply_stash
        if [[ ! $apply_stash =~ ^[Nn]$ ]]; then
            git stash pop
            print_color $GREEN "${CHECK} Stashed changes applied!"
        fi
    fi
}

# Push current branch
push_branch() {
    print_color $CYAN "${PUSH} Pushing Current Branch"
    echo ""
    
    local current_branch=$(get_current_branch)
    print_color $BLUE "Pushing branch: $current_branch"
    
    # Check if branch exists on remote
    if ! git ls-remote --heads origin "$current_branch" | grep -q "$current_branch"; then
        printf "Branch doesn't exist on remote. Create it? (Y/n): "
        read create_remote
        if [[ ! $create_remote =~ ^[Nn]$ ]]; then
            git push -u origin "$current_branch"
            print_color $GREEN "${CHECK} Branch created and pushed to remote!"
        fi
    else
        git push origin "$current_branch"
        print_color $GREEN "${CHECK} Successfully pushed to remote!"
    fi
}

# Repository info
repo_info() {
    print_color $CYAN "${INFO} Repository Information"
    echo ""
    
    print_color $BLUE "Repository Details:"
    echo "Remote URL: $(git remote get-url origin 2>/dev/null || echo 'No remote configured')"
    echo "Current Branch: $(get_current_branch)"
    echo "Total Commits: $(git rev-list --count HEAD 2>/dev/null || echo '0')"
    echo "Contributors: $(git shortlog -sn | wc -l)"
    echo ""
    
    print_color $BLUE "Recent Commits:"
    git log --oneline -10
    echo ""
    
    print_color $BLUE "Branch Status:"
    git status --short
    
    printf "\nPress Enter to continue..."
    read
}

# Git utilities
git_utilities() {
    print_color $CYAN "🔧 Git Utilities"
    echo ""
    
    print_color $WHITE "Choose a utility:"
    echo "  1. Clean up merged branches"
    echo "  2. Reset to last commit (soft)"
    echo "  3. Reset to last commit (hard)"
    echo "  4. View commit history (graph)"
    echo "  5. Search commits"
    echo "  6. Show file history"
    echo "  0. Back to main menu"
    echo ""
    printf "Enter your choice [0-6]: "
    read util_choice
    
    case $util_choice in
        1)
            print_color $YELLOW "Cleaning up merged branches..."
            git branch --merged | grep -v "\*\|main\|master\|develop" | xargs -n 1 git branch -d 2>/dev/null || true
            print_color $GREEN "${CHECK} Cleaned up merged branches!"
            ;;
        2)
            printf "Are you sure you want to soft reset to last commit? (y/N): "
            read confirm_soft
            if [[ $confirm_soft =~ ^[Yy]$ ]]; then
                git reset --soft HEAD~1
                print_color $GREEN "${CHECK} Soft reset completed!"
            fi
            ;;
        3)
            printf "⚠️  This will permanently lose uncommitted changes! Continue? (y/N): "
            read confirm_hard
            if [[ $confirm_hard =~ ^[Yy]$ ]]; then
                git reset --hard HEAD~1
                print_color $GREEN "${CHECK} Hard reset completed!"
            fi
            ;;
        4)
            git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit -20
            ;;
        5)
            printf "Enter search term: "
            read search_term
            if [ ! -z "$search_term" ]; then
                git log --grep="$search_term" --oneline
            fi
            ;;
        6)
            printf "Enter file path: "
            read file_path
            if [ ! -z "$file_path" ]; then
                git log --follow --patch -- "$file_path"
            fi
            ;;
        0)
            return
            ;;
        *)
            print_color $RED "${CROSS} Invalid option!"
            ;;
    esac
    
    printf "\nPress Enter to continue..."
    read
}

# Main function
main() {
    # Check if we're in a git repository
    check_git_repo
    
    while true; do
        show_menu
        read choice
        
        case $choice in
            1)
                quick_commit
                printf "\nPress Enter to continue..."
                read
                ;;
            2)
                smart_commit
                printf "\nPress Enter to continue..."
                read
                ;;
            3)
                branch_management
                ;;
            4)
                pull_changes
                printf "\nPress Enter to continue..."
                read
                ;;
            5)
                push_branch
                printf "\nPress Enter to continue..."
                read
                ;;
            6)
                print_color $YELLOW "${WARNING} Merge operations coming in next version!"
                printf "\nPress Enter to continue..."
                read
                ;;
            7)
                print_color $YELLOW "${WARNING} Tag management coming in next version!"
                printf "\nPress Enter to continue..."
                read
                ;;
            8)
                repo_info
                ;;
            9)
                git_utilities
                ;;
            0)
                print_color $GREEN "${CHECK} Thanks for using Git Manager!"
                exit 0
                ;;
            *)
                print_color $RED "${CROSS} Invalid option! Please try again."
                printf "\nPress Enter to continue..."
                read
                ;;
        esac
    done
}

# Run the script
main "$@"
