#!/bin/bash
# Session start hook for Trae
# Initializes skills and sets up the environment

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Source the initialization script
source "${SCRIPT_DIR}/../lib/initialize-skills.sh"

# Initialize skills for this project
echo "[superpowers] Initializing skills..."
initialize_skills "${PROJECT_ROOT}"

# Export skills path for the session
export SUPERPOWERS_SKILLS_PATH="${PROJECT_ROOT}/.trae/skills"

echo "[superpowers] Skills ready at: ${SUPERPOWERS_SKILLS_PATH}"
