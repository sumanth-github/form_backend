# **Product Transparency App**

A Full Stack + AI-powered application that collects product details and generates AI-guided follow-up questions to ensure complete transparency for **Food, Eco, and Wellness products**.

---

## **Backend – `form_backend`**

### **Setup Instructions**

1. Clone the repository:

```bash
git clone https://github.com/sumanth-github/form_backend.git
cd form_backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
MONGO_URI=<your_mongodb_connection_string>
PORT=5000
```

4. Start the backend server:

```bash
npm run dev
```

The backend exposes:

* **Product API:** `POST /api/products` for creating products, `GET /api/products` for listing
* **AI API:** `POST /api/ai/generate-next-question` for AI-powered follow-ups

---

### **Features**

* Store product details in MongoDB
* Generate AI-driven follow-up questions via Gemini AI
* Supports dynamic question generation based on previous answers
* Scalable architecture with separate AI and product services

---

### **AI Service Documentation**

* API Endpoint: `/api/ai/generate-next-question`
* Request payload:

```json
{
  "name": "Product Name",
  "category": "Food",
  "description": "Product description here",
  "previousAnswer": "Optional: last answer"
}
```

* Response:

```json
{ "question": "Next AI-generated follow-up question" }
```

---

### **Sample Product Entry**

```json
{
  "name": "Eco-friendly Water Bottle",
  "category": "Eco",
  "description": "Reusable stainless steel bottle with bamboo lid.",
  "questions": [
    { "question": "Is it BPA-free?", "answer": "Yes" },
    { "question": "Is the packaging recyclable?", "answer": "Yes, 100% recyclable materials" }
  ]
}
```

---

### **Reflection**

The AI integration allowed automatic, dynamic generation of follow-up questions, ensuring product transparency with minimal manual configuration. The backend architecture separates **data storage** (MongoDB) from **AI computation**, enabling scalability and maintainability. API design emphasizes **simplicity**, **predictability**, and **modularity**, allowing frontend developers to integrate easily without handling AI logic directly. Product transparency principles guided both the question generation and database schema, ensuring all essential product details are captured reliably.


