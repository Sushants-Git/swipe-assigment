## Swipe Assigment - Invoice Management System

![image](https://github.com/user-attachments/assets/d90684cc-2b0a-4256-ba45-b7329a191ea8)
![image](https://github.com/user-attachments/assets/be26ed0a-e01f-4734-8a70-568fcdd903b4)

## Processing Excel files (route : `/api/excel`)
![image](https://github.com/user-attachments/assets/57d641c0-784d-4bc7-a9a0-07647cafef86)

> [!NOTE] 
> We are not sending the whole Excel file to the backend, since getting the whole Excel file processed by gemini can use up a lot of tokens and it has been seen that longer the context given to ai more mistakes it commits.

**Approach** - The goal is to map the columns from an Excel sheet to the corresponding columns in our tables. For instance, the input file might have a column named `Party Name`, which needs to be mapped to `Customer Name` (`customerName` in code). Here's the process:

1. Extract the column headers from the first row of the Excel file (consistent across test cases).
2. Hash the extracted column names and check if a mapping exists in `localStorage`. If a mapping is found, use it.
3. If no mapping exists, select a few representative rows (e.g., rows 30, 60, and 90 from a 100-row dataset) along with the column names.
4. Send this reduced dataset to Gemini to generate the mappings. This avoids processing the full Excel file, saving tokens and reducing errors caused by lengthy AI inputs.
5. Retrieve the mapping response from Gemini, save it to `localStorage`, and use it for processing.

> [!NOTE] 
> Along with the mappings, we include a parameter called isTaxInPercentage, which indicates whether the tax value is a percentage. This allows us to dynamically display `%` or `₹` accordingly, as shown below.

![image](https://github.com/user-attachments/assets/75a868ed-c30d-4c49-af5d-4103fbb96984)  ![image](https://github.com/user-attachments/assets/5e15bbf4-6716-48ee-9af0-75c966bbc625)



## Processing pdf and image files (route : `/api/pdf-and-img`)

- For images and pdf files the process is pretty straight forward we feed gemini the image or pdf and ask it to generate the mapping in in the required form.

```
{
  "invoices": [
    {
      "serialNumber": "",
      "customerName": "",
      "productName": "",
      // ... other invoice fields
    },{
      "serialNumber": "",
      "customerName": "",
      "productName": "",
      // ... other invoice fields
    }
  ],
  "customers": [
    // customer objects
  ],
  "products": [
    // product objects
  ],
  "isTaxInPercentage": boolean
}
```
## Alerts
If the user uploads a file (`pdf/img`) that does not contain the relavent details, they get the alert shown below

![image](https://github.com/user-attachments/assets/d96aaa4b-fc32-4503-945e-4ec3576975fc)


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
