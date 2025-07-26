import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const dummyData = {
  user: {
    _id: "64f1b5e8c1234567890abcde",
    email: "john.doe@example.com",
    password: "hashed_password_123",
    firstName: "John",
    lastName: "Doe",
    files: ["64f1b5e8c1234567890abcdf"],
    analytics: ["64f1b5e8c1234567890abce0"],
    createdAt: "2025-07-26T08:00:00.000Z",
    updatedAt: "2025-07-26T08:00:00.000Z"
  },

  file: {
    _id: "64f1b5e8c1234567890abcdf",
    userId: "64f1b5e8c1234567890abcde",
    filename: "sales_q1_2025.xlsx",
    originalName: "Sales_Q1.xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 24576,
    data: [
      { name: "Alice Johnson", sales: 3200 },
      { name: "Bob Smith", sales: 4500 },
      { name: "Carlos Martinez", sales: 2800 },
      { name: "Diana Lee", sales: 3100 },
      { name: "Ethan Brown", sales: 3900 }
    ],
    createdAt: "2025-07-26T08:10:00.000Z",
    updatedAt: "2025-07-26T08:10:00.000Z"
  },

  analytic: {
    _id: "64f1b5e8c1234567890abce0",
    userId: "64f1b5e8c1234567890abcde",
    fileId: "64f1b5e8c1234567890abcdf",
    preview: [
      { id: 1, name: "Alice Johnson", sales: 3200 },
      { id: 2, name: "Bob Smith", sales: 4500 },
      { id: 3, name: "Carlos Martinez", sales: 2800 },
      { id: 4, name: "Diana Lee", sales: 3100 },
      { id: 5, name: "Ethan Brown", sales: 3900 },
      { id: 6, name: "Fiona Davis", sales: 3600 },
      { id: 7, name: "George Wilson", sales: 2400 },
      { id: 8, name: "Hannah Patel", sales: 2700 },
      { id: 9, name: "Isaac Kim", sales: 4100 },
      { id: 10, name: "Julia Robinson", sales: 2950 },
      { id: 11, name: "Kevin Nguyen", sales: 3300 },
      { id: 12, name: "Lena Chen", sales: 2500 },
      { id: 13, name: "Michael Scott", sales: 1800 },
      { id: 14, name: "Nina Lopez", sales: 2200 },
      { id: 15, name: "Oscar Turner", sales: 2700 },
      { id: 16, name: "Priya Verma", sales: 3400 },
      { id: 17, name: "Quincy Allen", sales: 2600 },
      { id: 18, name: "Rachel Green", sales: 3050 },
      { id: 19, name: "Steve Rogers", sales: 3700 },
      { id: 20, name: "Tina Sharma", sales: 4400 }
    ],
    insights: [
      "Tina Sharma had the highest sales.",
      "Average sales across 20 users: 3100.",
      "Bob Smith and Steve Rogers also performed above average."
    ],
    createdAt: "2025-07-26T08:15:00.000Z",
    updatedAt: "2025-07-26T08:15:00.000Z"
  }
};

export default dummyData;