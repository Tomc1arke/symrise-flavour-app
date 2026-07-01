# Symrise Flavor Creation App

This is a full-stack web application built for the Symrise application development use case. The app allows customers and flavorists to collaborate on creating custom toothpaste flavors.

## Tech Stack

- React + Vite frontend
- Python Flask backend
- SQLite database
- REST API
- Plain CSS

## Main Features

- Login for customers and flavorists
- Role-based dashboards
- Customers can create new flavors
- Customers can select ingredients and percentages
- Ingredient validation:
  - Maximum of 5 ingredients
  - Percentages must total 1.0
  - Percentages must use 0.05 increments
- Customers can submit flavors for review
- Customers can view flavor details
- Customers can revise flavors, creating a new version
- Flavorists can view submitted flavors
- Flavorists can add comments
- Flavorists can approve or reject flavors
- Dashboard notifications based on flavor status

## Project Structure

```text
symrise-flavour-app/
  client/
    src/
      api/
      components/
      pages/
      App.jsx
      App.css
      main.jsx
  server/
    routes/
    services/
    app.py
    db.py
    requirements.txt
  database/
    flavor_creation.db
  README.md
```

### Running the Backend

From the project root:

```
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend runs on:

`http://127.0.0.1:5000`

### Running the Frontend

Open a second terminal:

```
cd client
npm install
npm run dev
```

The frontend runs on:

`http://localhost:5173`

### Demo Login Details

Customer account:

```
Email: rpatel@example.com
Password: password
```

Flavorist account:

```
Email: jdupont@example.com
Password: password
```

### Notes:

The provided SQLite database schema was not modified. Notifications are derived from existing flavor states such as submitted, approved, and rejected.

Each revision creates a new flavor record with an increased version number instead of editing the existing flavor directly.