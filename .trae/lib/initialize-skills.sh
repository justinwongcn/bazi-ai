#!/bin/bash
# Skills initialization script
# Sets up and validates skills for a project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Initialize skills for a project
initialize_skills() {
    local PROJECT_ROOT="$1"
    local SKILLS_DIR="${PROJECT_ROOT}/.trae/skills"
    
    echo "[superpowers] Checking skills directory..."
    
    # Check if skills directory exists
    if [[ ! -d "${SKILLS_DIR}" ]]; then
        echo -e "${YELLOW}[superpowers] Skills directory not found at ${SKILLS_DIR}${NC}"
        echo "[superpowers] Creating skills directory..."
        mkdir -p "${SKILLS_DIR}"
    fi
    
    # Validate skills
    validate_skills "${SKILLS_DIR}"
    
    echo -e "${GREEN}[superpowers] Skills initialization complete${NC}"
}

# Validate that skills are properly formatted
validate_skills() {
    local SKILLS_DIR="$1"
    local VALID_COUNT=0
    local INVALID_COUNT=0
    
    echo "[superpowers] Validating skills..."
    
    # Find all SKILL.md files
    while IFS= read -r -d '' skill_file; do
        local skill_dir=$(dirname "${skill_file}")
        local skill_name=$(basename "${skill_dir}")
        
        if validate_skill_file "${skill_file}"; then
            echo -e "  ${GREEN}✓${NC} ${skill_name}"
            ((VALID_COUNT++))
        else
            echo -e "  ${RED}✗${NC} ${skill_name}"
            ((INVALID_COUNT++))
        fi
    done < <(find "${SKILLS_DIR}" -name "SKILL.md" -type f -print0 2>/dev/null)
    
    echo "[superpowers] Valid: ${VALID_COUNT}, Invalid: ${INVALID_COUNT}"
}

# Validate a single skill file
validate_skill_file() {
    local SKILL_FILE="$1"
    
    # Check if file exists and is readable
    if [[ ! -f "${SKILL_FILE}" ]] || [[ ! -r "${SKILL_FILE}" ]]; then
        return 1
    fi
    
    # Check for YAML frontmatter
    if ! grep -q "^---$" "${SKILL_FILE}"; then
        return 1
    fi
    
    # Check for name field
    if ! grep -q "^name:" "${SKILL_FILE}"; then
        return 1
    fi
    
    # Check for description field
    if ! grep -q "^description:" "${SKILL_FILE}"; then
        return 1
    fi
    
    return 0
}

# Get list of available skills
get_available_skills() {
    local SKILLS_DIR="$1"
    
    find "${SKILLS_DIR}" -name "SKILL.md" -type f -exec dirname {} \; | xargs -n1 basename | sort
}

# Main execution (if run directly)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    if [[ $# -eq 0 ]]; then
        echo "Usage: $0 <project_root>"
        exit 1
    fi
    
    initialize_skills "$1"
fi
