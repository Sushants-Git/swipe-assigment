## Processing Excel files

![image](https://github.com/user-attachments/assets/d426abd9-d561-426f-aa64-0d21c196ab2a)

> [!NOTE] 
> We are not sending the whole Excel file to the backend, since getting the whole Excel file processed by gemini can use up a lot of tokens and it has been seen that longer the context given to ai more mistakes it commits.

My Approach :
- The end goal is being able to map the excel sheet columns with our table columns (eg. the input table can have a column called "Party Name" and our table has a column called "Customer Name", we should be able to map these both.)
1. We extract the column names from the excel sheet. (which is usually the first row of a excel sheet, same goes for the given test cases).
2. 


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
