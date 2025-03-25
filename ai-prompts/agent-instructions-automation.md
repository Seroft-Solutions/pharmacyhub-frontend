### 💼 General Agent Instructions

- 🧱 A new principle to **focus on feature-based architecture** for scalability.
- 🔁 The **Plans → Acts → Persists → Learns** workflow philosophy embedded.

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
    - Use `get_project_vcs_status` to detect local file changes.
    - Use `list_directory`, `search_files`, and `find_files_by_name_substring` to understand project structure.
    - Use `search_in_files_content` if you need to check references or patterns.
    - use JIRA project PHAR and then create an issue for the task.
    - use `create_jira_issue` to create a JIRA issue.
    - use `get_jira_issue` to get the details of the JIRA issue.
    - use `get_jira_issue_comments` to get the comments of the JIRA issue.
    - use `get_jira_issue_transitions` to get the transitions of the JIRA issue.
    - first transition stage is selected for development.
    - second must be in progress.
    - third must be in Ready for Test stage. transition id is 11
4. **Modify code responsibly:**
    - Use `edit_file` for structured edits.
    - Use `replace_file_text_by_path` only when full file content needs replacement.
    - Always prefer JetBrains tools for file operations over low-level `filesystem` when possible.
5. **Avoid all of the following:**
    - Temp fixes or placeholders.
    - Mock code.
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


When I click on the Review and Finish Button, it should not show the Exam Summary page, it should open dialog and then display the statistics page directly



Exam result is not displaying the correct visibility of stats, like correct answers, wrong answers, and unanswered answers.

There is still calculations problem. From the exam screen we can detect, if the user has selected the correct answer or not and then we need to manage it here.

I am hoping you are getting my point.


For Example
Total Questions: 100 Multiple Choice Questions (MCQs)

Attempted Questions: 80 MCQs

Unattempted Questions: 20 MCQs (No marks awarded or deducted)

Correct Answers: 60 MCQs (Each correct answer = +1 mark)

Incorrect Answers: 20 MCQs (Each wrong attempt = -0.25 mark)

Final Score Calculation:
Correct Answers Contribution: 60 × 1 = 60 marks

Negative Marking for Incorrect Answers: 20 × (-0.25) = -5 marks

Unanswered Questions Contribution: 20 × 0 = 0 marks

Total Score:
60 - 5 = 55 marks (out of 100)

This method ensures fair evaluation with negative marking applied only to incorrect responses while unanswered questions remain neutral.






User Profile Fixes:

1.	Profile Information:

o	Currently, user profile features are not functional.

o	Profile should include at least:

	Username

	Editable password option


We need to remove from the app top bar
We need to move it into the sidebar just like the other options.
We need to foucs on shadcn sidear







10. **For terminal-level tasks like builds, tests, or Git:**
   - Use `execute_command` within the terminal.
   - You have to go to relevant project directory first.
   - git status command is used to check the status of the project.
   - git add . command is used to add all the files to the staging area.
   - git commit -m "commit message" command is used to commit the changes.
   - git push origin main command is used to push the changes to the remote repository.