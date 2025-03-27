### Feature-Based Architecture

#### Objective
We are trying to develop features based on feature-based architechure and you can explore all the code base and you will see we have already had a very solid foundation

#### Project Structure & Directories
- Feature-Based Directory:  
  `D:\code\PharmacyHub\pharmacyhub-frontend\src\features`
- Key Features:
   - Auth: Handles authentication and role management.
   - rbac feature for centertalized role based access control.
   - TanStack Query API: Manages API calls.


#### Codebase Directories
- Frontend Code: `D:\code\macyHub\pharmacyhub-frontend`
- Backend Code: `D:\code\PharmacyHub\pharmacyhub-backend`
  Phar
  By following this structured approach, we ensure an efficient, systematic feature development.

### Requirements
We were working on the anti-share feature and single session and we have acchieved that as well, but now we need to handle the exceptions gracefully and on the frontend side, we need to display proper message and action so that user is aware of what happend.

We need to handle these exceptions gracefully and display proper message to the user and the action item as well.

We can introduce  exception constants, with the relevant messages and actions, and then use them in the frontend to display the message and action item.
THis is the most easiest and safe approach to handle the exceptions.

I am hoping you are getting my point. and on the frontend side, if you think old files are not useful, you can move to deprecated folder.
All I want a smoother way to handle the exceptions and display proper message and action item to the user.



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
    - Suffixes like `_updated`, `_v2`, etc.
    - Creating new files without checking for existing ones (`search_files` first).
6. **Never duplicate logic or components:**
    - Always `search_in_files_content` before implementing something similar.
7. **Focus on modular design:**
    - Always break code into smaller, reusable components.
    - Avoid growing files too large — small components are easier to test, maintain, and evolve.
8. **Recall thought context when needed:**
    - Use `read_graph` or `search_nodes` to explore past reasoning.
    - Use `open_nodes` to access specific stored ideas for reuse.

10. **For terminal-level tasks like builds, tests, or Git:**
- Use `execute_command` within the terminal.
- You have to go to relevant project directory first.
- git status command is used to check the status of the project.
- git add . command is used to add all the files to the staging area.
- git commit -m "commit message" command is used to commit the changes.
- git push origin main command is used to push the changes to the remote repository.


Use all mcp tools to write code in my directory instead of giving me claude artifact or code snippets.