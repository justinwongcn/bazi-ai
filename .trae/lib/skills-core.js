/**
 * Skills Core Module
 * Shared functionality for skill discovery and management
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse YAML frontmatter from a skill file
 * @param {string} content - File content
 * @returns {Object} Parsed frontmatter and body
 */
function parseSkillFile(content) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (!frontmatterMatch) {
        return { frontmatter: {}, body: content };
    }
    
    const frontmatterText = frontmatterMatch[1];
    const body = frontmatterMatch[2].trim();
    
    // Parse YAML frontmatter
    const frontmatter = {};
    frontmatterText.split('\n').forEach(line => {
        const match = line.match(/^(\w+):\s*(.+)$/);
        if (match) {
            const key = match[1];
            let value = match[2].trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            frontmatter[key] = value;
        }
    });
    
    return { frontmatter, body };
}

/**
 * Find a skill by name
 * @param {string} skillsDir - Skills directory path
 * @param {string} skillName - Name of the skill to find
 * @returns {Object|null} Skill info or null if not found
 */
function findSkill(skillsDir, skillName) {
    const skillPath = path.join(skillsDir, skillName, 'SKILL.md');
    
    if (!fs.existsSync(skillPath)) {
        return null;
    }
    
    const content = fs.readFileSync(skillPath, 'utf-8');
    const { frontmatter, body } = parseSkillFile(content);
    
    return {
        name: frontmatter.name || skillName,
        description: frontmatter.description || '',
        path: skillPath,
        content: body,
        frontmatter
    };
}

/**
 * Get all available skills
 * @param {string} skillsDir - Skills directory path
 * @returns {Array} List of skill objects
 */
function getAllSkills(skillsDir) {
    if (!fs.existsSync(skillsDir)) {
        return [];
    }
    
    const skills = [];
    const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
    
    for (const entry of entries) {
        if (entry.isDirectory()) {
            const skillPath = path.join(skillsDir, entry.name, 'SKILL.md');
            if (fs.existsSync(skillPath)) {
                const skill = findSkill(skillsDir, entry.name);
                if (skill) {
                    skills.push(skill);
                }
            }
        }
    }
    
    return skills;
}

/**
 * Validate a skill file
 * @param {string} skillPath - Path to SKILL.md file
 * @returns {boolean} True if valid
 */
function validateSkill(skillPath) {
    try {
        const content = fs.readFileSync(skillPath, 'utf-8');
        const { frontmatter } = parseSkillFile(content);
        
        // Check required fields
        if (!frontmatter.name || !frontmatter.description) {
            return false;
        }
        
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Get skills matching a context
 * @param {string} skillsDir - Skills directory path
 * @param {string} context - Context to match against
 * @returns {Array} Matching skills
 */
function getRelevantSkills(skillsDir, context) {
    const allSkills = getAllSkills(skillsDir);
    const contextLower = context.toLowerCase();
    
    return allSkills.filter(skill => {
        const description = (skill.description || '').toLowerCase();
        const name = (skill.name || '').toLowerCase();
        const content = (skill.content || '').toLowerCase();
        
        return description.includes(contextLower) ||
               name.includes(contextLower) ||
               content.includes(contextLower);
    });
}

module.exports = {
    parseSkillFile,
    findSkill,
    getAllSkills,
    validateSkill,
    getRelevantSkills
};
