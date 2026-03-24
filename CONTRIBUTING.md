# Contributing Guidelines

To keep our collaboration smooth and our code clean, please follow these rules:

## 1. Branching Strategy
* **main**: Production-ready code only. Never commit directly to `main`.
* **feature/description**: Create a new branch for every task (e.g., `feature/data-viz` or `feature/api-integration`).

## 2. Workflow
1. **Pick a Task**: Assign yourself an issue on the **GitHub Project Board**.
2. **Create Branch**: `git checkout -b feature/your-task-name`
3. **Commit Regularly**: Use descriptive messages (e.g., `feat: add correlation matrix to EDA`).
4. **Pull Request (PR)**: Push your branch and open a PR. At least one teammate must review and approve it before merging to `main`.

## 3. Data & Notebook Rules
* **Clean Notebooks**: Always **"Clear All Outputs"** before committing a `.ipynb` file to keep the file size small and avoid merge conflicts.
* **Large Files**: Do not upload datasets >50MB to GitHub. Keep them local or use Git LFS.

## 4. Code Style & Formatting
To keep our codebase consistent, we use the following standards:

* **Black Formatter**: All Python code (`.py` files) must be formatted using **Black**. 
    * *VS Code Hint*: Install the "Black Formatter" extension and enable "Format on Save".
* **Docstrings**: Every function in `src/` must have a short docstring explaining what it does.
    ```python
    def clean_currency(column):
        """Removes '$' and ',' from a string column and converts to float."""
        return column.replace('[\$,]', '', regex=True).astype(float)
    ```
* **Naming**: Use `snake_case` for variables/functions and `PascalCase` for classes.

## 5. Clean Notebooks
* **Clear Outputs**: Before committing a Jupyter Notebook, go to `Kernel -> Restart & Clear All Outputs`.
* **No Scratchpad Code**: Delete temporary "test" cells or print statements that aren't part of the final analysis before pushing.

## 6. Dependencies
* If you install a new library (e.g., `pip install numpy`), immediately update the `requirements.txt` file.
