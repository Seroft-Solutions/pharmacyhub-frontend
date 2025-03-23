Can you go through from this ai-plan directory and see Readme.md file you will see, we have a detailed plan of implementation
D:\code\PharmacyHub\pharmacyhub-frontend\ai-plan
We have to achieve this and mark it complete as well for the traceability, if it is already marked then resume from where we left earlier.
use move_file tool to move all the old files to deprecated folder and I also dont need backward compatibily. As currently this is not in production.
you can check my VCS status to understand where we are at this time from the development perspective. We need to use move_file tool to move old files after the completion of every migration

# 💼 General Agent Instructions

> **Agent Philosophy:**  
> **Plans → Acts → Persists → Learns**  
> Always think in iterations. Understand the problem deeply, take action with intention, persist what you’ve learned, and reuse knowledge to improve continuously.

---

1. **Use `sequentialthinking`** to understand the complete flow of a task or feature.
2. **After each `sequentialthinking`, persist the thought:**
    - Use `create_entities` to create a memory node.
    - Use `add_observations` to store the thought content.
    - Optionally, use `create_relations` to link it to a feature, task, or file.
3. **Always organize and build in a feature-based architecture:**
    - Each module or screen should be a self-contained feature.
    - Keep business logic, UI components, and services grouped by feature.
    - Makes the system easier to scale and maintain.
4. **Before coding, analyze project status:**
    - Use `get_project_vcs_status` to detect local file changes.
    - Use `list_directory`, `search_files`, and `find_files_by_name_substring` to understand project structure.
    - Use `search_in_files_content` if you need to check references or patterns.
5. **Modify code responsibly:**
    - Use `edit_file` for structured edits.
    - Use `replace_file_text_by_path` only when full file content needs replacement.
    - Always prefer JetBrains tools for file operations over low-level `filesystem` when possible.
6. **Avoid all of the following:**
    - Temp fixes or placeholders.
    - Mock code.
    - Suffixes like `_updated`, `_v2`, etc.
    - Creating new files without checking for existing ones (`search_files` first).
7. **Never duplicate logic or components:**
    - Always `search_in_files_content` before implementing something similar.
8. **Focus on modular design:**
    - Always break code into smaller, reusable components.
    - Avoid growing files too large — small components are easier to test, maintain, and evolve.
9. **Recall thought context when needed:**
    - Use `read_graph` or `search_nodes` to explore past reasoning.
    - Use `open_nodes` to access specific stored ideas for reuse.
10. **For component, UI, or library questions:**
    - Use `brave_web_search` for real-time answers on Next.js, ShadCN, Tailwind, etc.
11. **For terminal-level tasks like builds, tests, or Git:**
    - Use `execute_terminal_command` within the JetBrains terminal.
    - Use `get_terminal_text` if you need to analyze terminal output.
12. **For testing/debugging:**
    - Use `get_run_configurations` to identify test configurations.
    - Use `run_configuration` to execute them.
    - Use `get_debugger_breakpoints` to view or set breakpoints.
13. **For frontend/browser interactions (optional):**
    - Use `puppeteer_navigate`, `puppeteer_click`, `puppeteer_fill`, etc. to automate E2E flows.
    - Use `puppeteer_screenshot` for visual diffing or UI test capture.