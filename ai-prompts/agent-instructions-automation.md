### Feature-Based Architecture

#### Objective
We are trying to develop features based on feature-based architechure and you can explore all the code base and you will see we have already had a very solid foundation

#### Project Structure & Directories
- Feature-Based Directory:  
  `D:\code\PharmacyHub\pharmacyhub-frontend\src\features`
- Key Features:
   - Auth: Handles authentication and role management.
   - rbac feature for centertalized role based access control.
   - I have feature TanStack Query API: Manages API calls.


#### Codebase Directories
- Frontend Code: `D:\code\macyHub\pharmacyhub-frontend`
- Backend Code: `D:\code\PharmacyHub\pharmacyhub-backend`
  Phar
  By following this structured approach, we ensure an efficient, systematic feature development.

### Requirements
Can you please update questions Navigator component? 
I want to have 20 questions per page, so when I click on next page it should open page 2 not go to the next mcq. please fix this properly

> **Agent Philosophy:**  
> **Plans → Acts → Persists → Learns**  
> Always think in iterations. Understand the problem deeply, take action with intention, persist what you’ve learned, and reuse knowledge to improve continuously.
> 

1. **Use `sequentialthinking`** to understand the complete flow of a task or feature.
2. **After each `sequentialthinking`, persist the thought:**
    - Use `create_entities` to create a memory node.
    - Use `add_observations` to store the thought content.
    - Optionally, use `create_relations` to link it to a feature, task, or file.
3. **Before coding, analyze project status:**
    - Use `git status` to detect local file changes.
    - Use `list_directory`, `search_files`, and `find_files_by_name_substring` to understand project structure.
    - Use `search_in_files_content` if you need to check references or patterns.
    - use JIRA project PHAR and then create an issue for the task.
    - use `create_jira_issue` to create a JIRA issue.
    - use `get_jira_issue` to get the details of the JIRA issue.
    - use `get_jira_issue_comments` to get the comments of the JIRA issue.
    - use `get_jira_issue_transitions` to get the transitions of the JIRA issue.
    - first transition stage is selected for development.
    - second must be in progress.
    - third must be in Ready for Test stage. transition id is 111
4. **Modify code responsibly:**
    - Use `edit_file` for structured edits.
    - Use `replace_file_text_by_path` only when full file content needs replacement.
    - Always prefer JetBrains tools for file operations over low-level `filesystem` when possible.
5. **Avoid all of the following:**
    - Temporary fixes or placeholders.
    - Dont include any Mock code.
    - Suffixes like `_updated`, `_v2`,enhanced, optimized etc.
    - Creating new files without checking for existing ones (`search_files` first).
6. **Never duplicate logic or components:**
    - Always `search_in_files_content` before implementing something similar.
7. **Focus on modular design:**
    - Always break code into smaller, reusable components.
    - Avoid growing files too large — small components are easier to test, maintain, and evolve.
8. **Recall thought context when needed:**
    - Use `read_graph` or `search_nodes` to explore past reasoning.
    - Use `open_nodes` to access specific stored ideas for reuse.
