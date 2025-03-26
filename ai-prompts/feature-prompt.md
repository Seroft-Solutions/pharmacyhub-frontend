### Feature-Based Architecture

#### Objective
We are trying to develop features based on feature based architechure and you can explore all the code base and you will see we have already had a very solid foundation

#### Project Structure & Directories
- Feature-Based Directory:  
  `D:\code\PharmacyHub\pharmacyhub-frontend\src\features`
- Key Features:
    - Auth: Handles authentication and role management.
    - rbac feature for centertalized role based access control.
    - TanStack Query API: Manages API calls.


### Requirement Summary

1. **Exam Types & Uploads**
  - The Exam Management module supports multiple exam types (e.g., Past Papers, Model Papers, Subject Papers).
  - While uploading a paper, admins can choose whether to mark it as **premium** or not.

2. **Premium Exams**
  - A new **Premium Exam** type is being introduced.
  - If an exam is marked as premium, users must pay to access it.
  - The fixed price for all premium papers is **PKR 2000**.

3. **Payment Integration**
  - Users can pay for premium exams using available payment providers (e.g., bank transfer, credit/debit cards, etc.).

4. **Frontend & Backend Development**
  - Both frontend and backend support is required for this feature.
  - Most core functionalities are already implemented.

5. **UI/UX Consistency**
  - Subject Papers currently contain mock data, but the UI (especially the paper card display) is ideal.
  - This same UI style should be reused for **Past Papers**, **Model Papers**, and **Subject Papers**.

6. **Paper Navigation Flow**
  - The **Model Papers** navigation is well-designed.
  - The same flow should be used for all kind of Papers:  
    **Exam Instructions → Start Paper → Display MCQs and Components**.

7. **API Integration**
  - All API calls must utilize the **TanStack Query API** feature.


### Coding instructions
- Use `sequential_thinking` to understand the complete flow.
- Utilize JetBrains tools for code refactoring.
- Check VCS status to understand the current development changes
- You can use brave_search to understand the the nextjs and shadcn components.
- Avoid rewriting code manually; instead, use:
    - `move_file` to move files.
    - `edit_file` to modify existing files.
    - `search in files` to locate references.
    - `replace in files` to update code.
- Ensure you can use all mcp tools, like filesystem, sequential_thinking, etc
- Dont use any suffix or prefix like enhanced, update etc. Always fix the original file, and before writing any new file, please do search and see if it already there or not.
- Ensure, you never need to write any temp fix, any mock thing

#### Codebase Directories
- Frontend Code: `D:\code\macyHub\pharmacyhub-frontend`
- Backend Code: `D:\code\PharmacyHub\pharmacyhub-backend`
  Phar
By following this structured approach, we ensure an efficient, systematic feature development.