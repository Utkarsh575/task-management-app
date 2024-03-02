## Hierarchal task management app

## Steps to run the application

### Configuring the backend

- unzip the backend zip.
- `pip install virtualenv`
- `virtualenv venv`
- `.\venv\Scripts\activate.ps1`
- `pip install -r requirements.txt`
- `py main.py`

### Now the server would start running on port http://localhost:3000/

### Configuring the Frontend

- unzip the folder
- npm i --legacy-peer-deps
- npm run dev

#### Now the Frontend Client would start running on port http://localhost:3001/

for deployment with vercel (FE)

- keep the source directory as empty or '/'
- deploy the backend and replace the term `http://localhost:3000/` with you deployment url

for deployment of the backend make sure you add the content of `.env` to your server environment.
