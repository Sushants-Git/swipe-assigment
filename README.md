## Processing Excel files

![image](https://github.com/user-attachments/assets/d426abd9-d561-426f-aa64-0d21c196ab2a)

> [!NOTE] 
> We are not sending the whole Excel file to the backend, since getting the whole Excel file processed by gemini can use up a lot of tokens and it has been seen that longer the context given to ai more mistakes it commits.

**Approach** - The goal is to map the columns from an Excel sheet to the corresponding columns in our tables. For instance, the input file might have a column named `Party Name`, which needs to be mapped to `Customer Name` (`customerName` in code). Here's the process:

1. Extract the column headers from the first row of the Excel file (consistent across test cases).
2. Hash the extracted column names and check if a mapping exists in `localStorage`. If a mapping is found, use it.
3. If no mapping exists, select a few representative rows (e.g., rows 30, 60, and 90 from a 100-row dataset) along with the column names.
4. Send this reduced dataset to Gemini to generate the mappings. This avoids processing the full Excel file, saving tokens and reducing errors caused by lengthy AI inputs.
5. Retrieve the mapping response from Gemini, save it to `localStorage`, and use it for processing.

## Running the project locally

1. Install dependencies
```bash
bun install
```

2. Set up the environment variable with Gemini API key
```bash
# .env
GOOGLE_API_KEY=<your_api_key>
```

3. Start the development server
```bash
bun run dev
```
