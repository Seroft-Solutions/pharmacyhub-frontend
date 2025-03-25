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



### 🎯 **Issue Summary:**
When starting a new exam, the previous exam state is **not reset properly** — this results in leftover data (like selected answers, timer state, or progress) being carried over into the new session.


1. **Navigates to Exam Page:**
   - You open the exam section of the application.
   - The UI loads the exam screen where questions are listed with answer options.

2. **Starts the Exam:**
   - You click the “Start Exam” or similar button.
   - Timer begins.
   - The first question is shown.

3. **Selects Some Answers:**
   - You select answers for a few questions (e.g., Q1, Q2, etc.).
   - You may even navigate to different pages/questions.

4. **Leaves the Exam:**
   - Either by going back or reloading the page — you simulate ending or exiting the session.

5. **Restarts the Exam:**
   - You go back to the exam and start it again.
   - **Bug Appears:** Previously selected answers are still present.
   - Timer might not be reset properly.
   - The progress made in the earlier attempt seems to persist instead of starting fresh.

---

### 🐞 **Bug Behavior Observed:**
- Exam state is **not reset** when a new exam is started.
- Expected behavior is: **Each new exam session should begin from a clean state** — no answers selected, timer reset, progress cleared.

---

### ✅ **Expected Behavior:**
- When clicking **“Start Exam”**, the app should:
   - Clear all previously selected answers.
   - Reset the timer to full duration.
   - Load the first question as if it's a fresh session.
   - Clear any stored progress or question flags from the previous session.

---

### 💡 Suggested Fix:
Ensure that the following actions happen on "Start Exam":
- Clear relevant local state (e.g., Redux store, local storage, or backend session).
- Reinitialize the timer.
- Remove any saved answers or cached question states.
- Handle re-entry logic cleanly in the component lifecycle.

---