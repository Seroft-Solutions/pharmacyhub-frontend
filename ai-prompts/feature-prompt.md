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


#### Requirement Summary
-In the Exam Management, we have different types, and by which we upload the papers.
- Now I want to intrdouce a field call premium in the exam type, and if the exam type is premium, then the user has to pay for it.
- The user can pay for the exam by using the wallet or card etc
- We can setup a paper custom, like for some papers we can charge separately , and for some papers we can charge together. I need such things to be implemented.
- for example, I want user to pay for the exam type premium, and for the paper custom, I want to charge for the paper custom.
- We need to implement the frontend and backend as well.
- For any api call, you have to use the `TanStack Query API` feature.


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
- Frontend Code: `D:\code\PharmacyHub\pharmacyhub-frontend`
- Backend Code: `D:\code\PharmacyHub\pharmacyhub-backend`

By following this structured approach, we ensure an efficient, systematic feature development.